import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Modal, Input, DatePicker, Table, InputNumber, Popconfirm } from "antd";
import { db } from "./Firebaseconfig";
import moment from 'moment';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc, getFirestore, onSnapshot, serverTimestamp, query, limit, orderBy, where } from 'firebase/firestore';

function AntFirebase() {
    const [userlist, setUserlist] = useState([])
    const [name, setName] = useState("")
    const [age, setAge] = useState ("")
    const [place, setPlace] = useState("")
    const [dob, setDob] = useState("")
    const [formattedDate, setFormattedDate] = useState('');
    const [company, setCompany] = useState("")
    const [designation, setDesignation] = useState("")
    const [form] = Form.useForm();
    const userCollRef = collection(db, "user")

    const navigate=useNavigate();

    const handleDateChange = () => {
        const newDate = new Date();
        setDob(newDate);
        // const date = moment(newDate).format('MMMM Do YYYY');
        // const formatted = date / 1000;
        // const datestamp = formatted/1000;
        const formatted = newDate.getTime();
        setFormattedDate(formatted);
    };
   
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const dbb = getFirestore();
        // const addlist = query(collection(dbb, "user"), where("Age", ">", "21"), orderBy("Age"), limit(5))
        const addlist = collection(dbb, "user")
        onSnapshot(addlist, (snapshot) => {
            const newData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserlist(newData);
        });
        // return add;
    }

    const adduser = async () => {
        navigate("/userlist")
        const db = getFirestore();
        await addDoc(userCollRef, {
            Name: name,
            Age: age,
            Place: place,
            DateOfBirth: formattedDate,
            Company: company,
            Designation: designation,
            timestampField: serverTimestamp(),

        });
       
        form.resetFields();
        fetchData();
        console.log(userlist)
    }

    return (
        <div >
            <h3 style={{ textAlign: "center" }}> User Lists </h3>
            <Form
                form={form}
                onFinish={adduser}
                labelCol={{
                    span: 10,
                }}
                wrapperCol={{
                    span: 5,
                }}
            >

                <Form.Item name="Name" label="Name">
                    <Input placeholder="Enter your Name" onChange={(e) => setName(e.target.value)} />
                </Form.Item>

                <Form.Item name="Age" label="Age">
                    <Input placeholder="Enter your Age" onChange={(e) => setAge(e.target.value)} />
                </Form.Item>

                <Form.Item name="Place" label="Place">
                    <Input placeholder="Enter your Place" onChange={(e) => setPlace(e.target.value)} />
                </Form.Item>

                <Form.Item name="Dob" label="Date of Birth">
                    <DatePicker type="date" style={{ width: "200px" }}
                        value={dob}
                        // selected={dob}
                        onChange={handleDateChange}
                        // onChange={(date) => setDob(date)}
                    />
                </Form.Item>

                <Form.Item name="Company" label="Company">
                    <Input placeholder="Enter your Company" onChange={(e) => setCompany(e.target.value)} />
                </Form.Item>

                <Form.Item name="Designation" label="Designation">
                    <Input placeholder="Enter your Designation" onChange={(e) => setDesignation(e.target.value)} />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 11,
                        span: 18,
                    }}>
                    <Button htmlType="submit">Add User</Button>

                </Form.Item>
            </Form>

        </div>
    )
}
export default AntFirebase;