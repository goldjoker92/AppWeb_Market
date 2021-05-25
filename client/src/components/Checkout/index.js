import React, { useEffect } from 'react';
import {useFormValidation} from"../../lib/hooks/useFormValidation";
import {useDispatch, useSelector} from "react-redux";
import {setDelivery} from '../../lib/state/actions';
import * as Input from '../Auth/Input';
import Payment from './Payment';
import DeliveryBox from './DeliveryBox';

const defaultValues = { 
	delivery: 'standard',
	address: ''
}

const options = ['Canada', 'Russia', 'United States', 'India', 'Afganistan']
const Checkout = () => { 
	const { user } = useSelector(state => state.user);
	const dispatch = useDispatch();
	const {first, last, email, city, country, gender} = user ?? {};
	const {
		formValues,
		validate,
		register,
		handleOnChange,
		isValid,
	} = useFormValidation({formName:"checkout"});
	useEffect(() =>{
		register(defaultValues);
	}, []);
	const {delivery, address } = formValues["checkout"] ?? {};
	useEffect(() =>{
		validate(formValues['checkout'] ?? {});
		},[formValues]);
		const handleOnChangeDelivery = (e, value) => {
			handleOnChange(e, value);
			dispatch(setDelivery(value))
		}
	return (
	<>
	<section className="section-content padding-y" style={{ margin: '100px auto', maxWidth: '720px' }}>
		<div className="container" >

			<div className="card mb-4">
				<div className="card-body">
				<h4 className="card-title mb-3">Delivery info</h4>

				<div className="form-row">
					<div className="form-group col-sm-6">
						<DeliveryBox title="standard" value={delivery} message="Free by airline within 20 days" onChange={(e) =>handleOnChangeDelivery(e, 'standard')}/>
					</div>
					<div className="form-group col-sm-6">
						<DeliveryBox title="fast" message="Extra 20$ will be charged" onChange={(e) =>handleOnChangeDelivery(e, 'fast')}/>
					</div>
				</div>

				<div className="form-row">
					<Input.Text label="First name" value={first}name="first" onChange={handleOnChange} />
					<Input.Text label="Last name" value={last} name="last"  onChange={handleOnChange} />
				</div> 

				<div className="form-row">
					<Input.Email label="Email" value={email} onChange={handleOnChange} col="6" />	
				</div> 
				<div className="form-row">
					<Input.Select name='country' value={country} options={options}  label="Country" col="6" onChange={handleOnChange}/>
					<Input.Text label="City" value={city} name='city'onChange={handleOnChange} />
				</div> 
					<Input.TextArea label="Address" name="address" onChange={handleOnChange}/> 
				</div> 
				<div className="form-row" style={{padding: '0 25px 30px'}}>
					<Payment  isValid={!isValid}/>	
				</div>
		</div> 
	</div>
</section>
</>
)}
export default Checkout