import React, { Component } from 'react';
import { ErrorMessage, Field } from 'formik';
import { Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'

class ScanResult extends Component {
    render() {
        const result = (this.props.initialValues.status === 'in-progress') ? (<Col md={12} className="form-group">
            <Field
                name="result"
                render={({ field, form: { isSubmitting } }) => {
                    return <select className="form-control" {...field}
                        placeholder="result" autoComplete="Result" name="result">
                        <option value=""> Select Result</option>
                        <option value="success"> Success</option>
                        <option value="failed"> Failed</option>
                    </select>
                }}
            />
            <ErrorMessage render={msg => <div className="error">{msg}</div>} name="result" />
        </Col>) : null;

        const action = (!this.props.initialValues.status || this.props.initialValues.status === 'in-progress') ?
            <Col sm={5} className="text-right">
                <Button className="btn btn-primary" type="submit">{(!this.props.initialValues.status) ? 'Add To Queue' : 'Finish Scan'}</Button>
            </Col>
            : null;

        return <form onSubmit={this.props.handleSubmit}>
            <Col md={12} className="form-group">
                <Field
                    name="repositoryName"
                    render={({ field, form: { isSubmitting } }) => {
                        return <input className="form-control" {...field}
                            type="text" placeholder="Repository Name" autoComplete="repositoryName" name="repositoryName" disabled={this.props.initialValues._id} />
                    }}
                />
                <ErrorMessage render={msg => <div className="error">{msg}</div>} name="repositoryName" />
            </Col>

            {result}

            <Col md={12} className="form-group">
                <Field
                    name="findings"
                    render={({ field, form: { isSubmitting } }) => (
                        <textarea className="form-control" {...field}
                            type="text" placeholder="Findings" autoComplete="Findings" name="findings" disabled={this.props.initialValues.status !== 'in-progress'} rows="10" />
                    )}
                />
                <ErrorMessage render={msg => <div className="error">{msg}</div>} name="findings" />
            </Col>
            <Col sm={6} className="text-left">
                <Link to="/" >Back</Link >
            </Col>
            {action}
        </form >
    }
}
export default ScanResult; 