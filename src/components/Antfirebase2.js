import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Form, Button, Modal, Input, DatePicker, Table, InputNumber, Popconfirm } from "antd";
import { db } from "./Firebaseconfig";
import moment from 'moment';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc, getFirestore, onSnapshot, serverTimestamp, query, limit, orderBy, where, startAt, startAfter } from 'firebase/firestore';

function AntFirebase2() {
    const [userlist, setUserlist] = useState([])
    const [name, setName] = useState("")
    const [age, setAge] = useState("")
    const [place, setPlace] = useState("")
    const [dob, setDob] = useState("")
    const [formattedDate, setFormattedDate] = useState('');
    const [company, setCompany] = useState("")
    const [designation, setDesignation] = useState("")
    const [lastVisible, setLastVisible] = useState([])
    const [searchText, setSearchText]= useState("")
    const [form] = Form.useForm();
    const userCollRef = collection(db, "user")
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.id === editingKey;
    const navigate = useNavigate();


    const columns = [
        {
            title: "Name",
            dataIndex: "Name",
            editable: true,
            filteredValue:[searchText],
            onFilter: (value , record) => {
                return (
                 String(record.Name)
                .toUpperCase()
                .includes(value.toUpperCase()) ||
                Number(record.Age) === parseInt(value) ||
                String(record.Place)
                .toUpperCase()
                .includes(value.toUpperCase()) ||
                String(record.Company)
                .toUpperCase()
                .includes(value.toUpperCase()) ||
                String(record.Designation)
                .toUpperCase()
                .includes(value.toUpperCase())
                )
            }
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
        let addlist;

        if (lastVisible) {
            addlist = query(collection(dbb, "user"),
                orderBy("Age"),
                // startAfter(lastVisible),
                // limit(1))
            )
        }

        else {
            addlist = query(collection(dbb, "user"),
                // limit(1),
                orderBy("Age")
                // where("Age", ">", "21"),
                // startAt("23")
            )
        }
        // const addlist = query(collection(dbb, "user"), where("Age", ">", "21"), orderBy("Age"), limit(5))
        onSnapshot(addlist, (snapshot) => {
            const lastdoc = snapshot.docs[snapshot.docs.length - 1];
            setLastVisible(lastdoc)
            const newData = snapshot.docs.map(doc =>
                ({ id: doc.id, ...doc.data() }));
            // setUserlist(newData);
            if (lastVisible) {
                let temp = [...userlist, ...newData];
                setUserlist(temp)
            } else {
                setUserlist(newData);
            }
            console.log("data", newData)
        });

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
        const db = getFirestore();
        try {
            // const upd = async (record) => {
            //     const userdoc = doc(db, "user", record.id)
            //     await updateDoc(userdoc);
            //     setUserlist(upd)
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
        <div>
            {/* <Button onClick={fetchData}> Add List</Button> */}
            <Button onClick={() => navigate("/")}> Back </Button>
            <div >
                <h3 style={{ textAlign: "center" }}> User Lists </h3>
                <Form
                    form={form}>

                    <Input.Search placeholder="Search Here" style={{ marginBottom: "3px", width: "300px" }} 
                    onSearch={(value) => {
                        setSearchText(value)
                        }}
                        onChange={(e) => {
                            setSearchText(e.target.value)
                        }}/>
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



            </div>
        </div>
    )
}
export default AntFirebase2;

