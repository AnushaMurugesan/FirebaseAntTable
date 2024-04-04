import React, { useState, useEffect } from "react";
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
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.id === editingKey;

    const handleDateChange = () => {
        const newDate = new Date();
        setDob(newDate);
        const formatted = moment(dob).format('MMMM Do YYYY');
        setFormattedDate(formatted);
        
    };
    // console.log(formattedDate)

    const columns = [
        {
            title: "Name",
            dataIndex: "Name",
            editable: true,
        },

        {
            title: "Age",
            dataIndex: "Age",
            editable: true,
        },

        {
            title: "Place",
            dataIndex: "Place",
            editable: true,
        },

        {
            title: "Date of birth",
            dataIndex: "DateOfBirth",
            editable: true
        },

        {
            title: "Company",
            dataIndex: "Company",
            editable: true,
        },

        {
            title: "Designation",
            dataIndex: "Designation",
            editable: true,
        },
        {
            title: 'Actions',
            dataIndex: 'Actions',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Button
                            onClick={() => save(record)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Button>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <div>
                        <Button style={{ marginLeft: "5px" }} onClick={() => edit(record)}> Edit </Button>
                        <Button style={{ marginLeft: "10px" }} onClick={() => deluser(record)}> Delete </Button>
                    </div>
                );
            },
        },

    ]
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

    const deluser = async (record) => {
        const userdoc = doc(db, "user", record.id)
        await deleteDoc(userdoc);
    }

    const edit = (record) => {
        console.log(record)
        form.setFieldsValue({
            ...record,
        });
        console.log("Edit")
        setEditingKey(record.id);
    };

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const cancel = () => {
        setEditingKey('');
    };


    const save = async (record) => {
        try {
            const row = await form.validateFields();
            const newData = [...userlist];
            const index = newData.findIndex((item) => record.id === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setUserlist(newData);
                console.log(newData)
                setEditingKey('');
                const db = getFirestore();
                const upd = doc(db, "user", record.id)
                await updateDoc(upd);


            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    // console.log('userlist', userlist)

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });


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
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={userlist}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                // pagination={{
                //     onChange: cancel,
                // }}
                >
                </Table>

            </Form>
            <div>


            </div>

        </div>
    )
}
export default AntFirebase;