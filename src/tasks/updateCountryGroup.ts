import { db } from "@/lib/database";
import countriesByDiscountData from "../lib/data/countryDiscountsByGroup.json";
import { CountryGroupTable, CountryTable } from "@/lib/database/schemas/schema";
import { sql } from "drizzle-orm";

async function main() {
  const groupCount = await updateCountryGroups();
  const countryCount = await updateCountries();

  console.log(
    `Updated ${groupCount} country groups and ${countryCount} countries`
  );
}

main().catch(console.error);

async function updateCountryGroups() {
  const countryGroupInsertData = countriesByDiscountData.map(
    ({ name, recommendedDiscountPercentage }) => {
      return { name, recommendedDiscountPercentage };
    }
  );

  const { rowCount } = await db
    .insert(CountryGroupTable)
    .values(countryGroupInsertData)
    .onConflictDoUpdate({
      target: CountryGroupTable.name,
      set: {
        recommendedDiscountPercentage: sql.raw(
          `excluded.${CountryGroupTable.recommendedDiscountPercentage.name}`
        ),
      },
    });

  console.log(`Country groups updated: ${rowCount || 0}`);
  return rowCount || 0;
}

async function updateCountries() {
  const countryGroups = await db.query.CountryGroupTable.findMany({
    columns: { id: true, name: true },
  });

  const countryInsertData = countriesByDiscountData.flatMap(
    ({ countries, name }) => {
      const countryGroup = countryGroups.find((group) => group.name === name);
      if (countryGroup == null) {
        throw new Error(`Country group "${name}" not found`);
      }
      return countries.map((country) => {
        return {
          name: country.countryName,
          code: country.country,
          countryGroupId: countryGroup.id,
        };
      });
    }
  );

  const { rowCount } = await db
    .insert(CountryTable)
    .values(countryInsertData)
    .onConflictDoUpdate({
      target: CountryTable.code,
      set: {
        name: sql.raw(`excluded.${CountryTable.name.name}`),
        countryGroupId: sql.raw(`excluded.${CountryTable.countryGroupId.name}`),
      },
    });

  console.log(`Countries updated: ${rowCount || 0}`);
  return rowCount || 0;
}