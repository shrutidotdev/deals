import BackButton from '../../_component/BackButton'
import ProductDetailsForm from '../../form/ProductDetailsForm'

const NewProductAdd = () => {
  return (
    <div className='py-8 px-14'>


      <BackButton title='Create Deals' hrefTo='/dashboard' >
        <ProductDetailsForm />
      </BackButton>
    </div>
  )
}

export default NewProductAdd