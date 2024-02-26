import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import FormikControl from './FormikControl';
import './FormikContainer.css';
import { Link, useNavigate, useParams } from 'react-router-dom';

function FormikContainer({title}) {

    const[userData, setUserData] = useState({});
    const {userid} = useParams();
    const navigate = useNavigate();
    
    useEffect( () => {
        
        userid && fetch("http://localhost:8000/users/"+userid)
        .then((res) => {
            return res.json();
        })
        .then((resp) => {
            // debugger;
            setUserData(resp);
        })
        .catch((err) => {
            console.log(err);
        })
      }, [])

    const dropDownOptions = [
        { key: 'Select skill', value: '' },
        { key: 'JavaScript', value: 'JavaScript' },
        { key: 'Java', value: 'Java' },
        { key: 'Python', value: 'Python' },
    ]

    const radioOptions = [
        { key: 'Male', value: 'Male' },
        { key: 'Female', value: 'Female' },
        { key: 'Other', value: 'Other' },
    ]

    const initialValues = {
        username: userData?.username || '',
        email: userData?.email || '',
        password: userData?.password || '',
        confirmPassword: '',
        description: userData?.description || '',
        selectOption: userData?.selectOption || '',
        radioOption: userData?.radioOption || '',
        birthDate: userData?.birthDate || null
    };

    const birthdayParsed = (strDate) =>{

        //parse the input date string
        const date = new Date(strDate);

        //extract year, month and day
        const year = date.getFullYear();

        const month = date.getMonth() + 1; // Month is zero-based, so add 1
        const day = date.getDate();

        // Construct the birthdate string
        const birthdate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
        
        return birthdate;
    }

    const validationSchema = yup.object({
        username: yup.string().required(),
        email: yup.string().required().matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Enter valid Email"),
        password: yup.string().required().min(7).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,"Enter Strong Password").required("Please Enter password"),
        confirmPassword: yup.string().required().oneOf([yup.ref('password'), null], 'Both passwords must match'),
        description: yup.string().required(),
        selectOption: yup.string().required(),
        radioOption: yup.string().required(),
        birthDate: yup.date().required('Date of Birth is Required').max(new Date(), 'Please enter proper birth date')
    });

    const addNewUser = (data, formik) => {
        fetch("http://localhost:8000/users", {
            method:"POST",
            headers:{"content-type":"application/json"},
            body: JSON.stringify(data)
        }).then((res) => {
            formik.resetForm();
            alert('Saved successfully');
            navigate('/');
        }).catch((error) => {
            console.log('error', error);
        })
    }

    const updateUser = (userid, data, formik) => {
        fetch("http://localhost:8000/users/"+userid, {
            method:"PUT",
            headers:{"content-type":"application/json"},
            body: JSON.stringify(data)
        }).then((res) => {
            formik.resetForm();
            alert('Saved successfully');
            navigate('/');
        }).catch((error) => {
            console.log('error', error);
        })
    }

    const onSubmit = (values, formik) => {

        const data = values;

        data.birthDate = birthdayParsed(data.birthDate);

        if(!userid) {
            addNewUser(data, formik);
        }else{
            updateUser(userid, data, formik);
        }

    }
    return (
        <>
        <h1 style={{marginLeft: '35%'}}>{title}</h1>
        <div className='App'>
            <Formik
                initialValues={ initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {formik => (
                    <Form>

                        <FormikControl
                            control="input"
                            type="text"
                            label="Username"
                            name="username"
                        />

                        <FormikControl
                            control="input"
                            type="email"
                            label="Email"
                            name="email"
                        />

                        <FormikControl
                            control='textarea'
                            label='Description'
                            name='description'
                        />

                        <FormikControl
                            control='select'
                            label='Select a topic'
                            name='selectOption'
                            options={dropDownOptions}
                        />

                        <FormikControl
                            control='radio'
                            label='Gender'
                            name='radioOption'
                            options={radioOptions}
                        />

                        <FormikControl
                            control='date'
                            label='Date of Birth'
                            name='birthDate'
                        />

                        <FormikControl
                            control="input"
                            type="password"
                            label="Password"
                            name="password"
                        />

                        <FormikControl
                            control="input"
                            type="password"
                            label="Confirm Password"
                            name="confirmPassword"
                        />

                        <button className='btn btn-primary' style={{ marginRight:"5px", marginBottom:"5px"}} type="submit">Submit</button>
                        <Link className='btn btn-success' to="/" style={{ marginRight:"5px", marginBottom:"5px"}}>Back</Link>
                    </Form>
                )}
            </Formik>
        </div>
        </>
    )
}

export default FormikContainer