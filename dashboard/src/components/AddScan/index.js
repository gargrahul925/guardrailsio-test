import React, { Component } from 'react';
import { Formik } from 'formik';
import { Container, Row, Col } from 'react-bootstrap';
import * as Yup from "yup";
import { useHistory } from "react-router-dom";

import ScanResultForm from '../Forms/ScanResult'

import { getResultByID, addToQueue, finishScanning } from '../../api'

import './index.css';

const ScanResultSchema = Yup.object().shape({
    repositoryName: Yup.string()
        .required('Repositroy Name is required'),
    findings: Yup.string()
});

class Contacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: {
                _id: '',
                repositoryName: '',
                findings: '',
                status: '',
                result: ''
            }
        }

    }

    async submit(values) {
        const payload = {};
        if (!values.status) {
            payload.repositoryName = values.repositoryName;
        }
        if (!values.status) {
            await addToQueue(payload)
        } else if (values.status === 'in-progress') {
            await finishScanning(values._id, { findings: JSON.parse(values.findings), status: values.result })
        }
        // TODO: redirect to home screen

    }

    async componentWillMount() {
        if (this.props.match.params.id) {
            this.setState({ loading: true });
            const result = await getResultByID(this.props.match.params.id);
            if (result) {
                const extendedValues = {
                    findings: (result.findings) ? JSON.stringify(result.findings) : '',
                    result: ''
                };
                this.setState({ data: Object.assign({}, result, extendedValues), loading: false });
            } else {
                alert('Scan with given id not found');
            }
        } 
    }

    render() {
        console.log(this.state.data)
        let template = <Col md="12"> Loading...</Col>;
        if (!this.state.loading) {
            template = <Col md="12">
                <Formik
                    initialValues={this.state.data}
                    onSubmit={this.submit}
                    component={ScanResultForm}
                    validationSchema={ScanResultSchema}
                    validateOnChange={false}
                />
            </Col>
        }
        return (
            <div className="wrapper">
                <Container>
                    <Row className="justify-content-center">
                        {template}
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Contacts;