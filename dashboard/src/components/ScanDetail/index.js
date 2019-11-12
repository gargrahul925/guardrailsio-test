import React, { Component } from 'react';

import { Table, Container, Row, Col, Badge } from 'react-bootstrap';

import { getResultByID } from '../../api'

import './index.css'

class ScanResults extends Component {

    constructor() {
        super()
        this.state = {
            loading: true,
            result: null,
        }
    }

    async componentWillMount() {
        const result = await getResultByID(this.props.match.params.id);
        if (result) {
            this.setState({ result: result, loading: false });
        } else {
            alert('Scan result with given id not found');
        }
    }
    render() {
        let template = <Row><Col md={12} className="text-center"> <h3> Loading....</h3> </Col></Row>
        if (!this.state.loading && this.state.result) {
            const badge = this.state.result.status === 'scanned' ? <Badge variant="primary">Primary</Badge> : null;
            const scanningAt = this.state.result.scanningAt ? <Col md={12}><b>Scanning At</b>:  {this.state.result.scanningAt}  </Col> : null;
            const finishedAt = this.state.result.finishedAt ? <Col md={12}><b>Finished At</b>:  {this.state.result.finishedAt}  </Col> : null;
            let findings = null;
            if (this.state.result.finishedAt) {
                if (!this.state.result.findings.length) {
                    findings = <Col md={12}>
                        <h3>Findings </h3>
                        <p>No Major Findings</p>
                    </Col>
                } else {
                    let list = this.state.result.findings.map((finding, i) => {
                        return <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{finding.ruleId}</td>
                            <td>{finding.metadata.description}</td>
                            <td>{finding.metadata.severity}</td>
                            <td>{finding.location.path}:{finding.location.positions.begin.line} {(finding.location.positions.end) ? <span> - {finding.location.positions.end.line}</span> : null} </td>
                        </tr>
                    });
                    findings = (<Col md={12}>
                        <h3>Findings: </h3>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>RuleId</th>
                                    <th>Description</th>
                                    <th>Severity</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list}
                            </tbody>
                        </Table>
                    </Col>);
                }
            }
            template = <Row className="detail">
                <Col md={12}><h3><b>Repository Name</b>:  {this.state.result.repositoryName} </h3> {badge} </Col>
                <Col md={12}><b>Status</b>:  {this.state.result.status}  </Col>
                <Col md={12}><b>Queued At</b>:  {this.state.result.queuedAt}  </Col>
                {scanningAt}
                {finishedAt}
                {findings}
            </Row>
        }

        return (
            <div id="scan-result">
                <Container>
                    {template}
                </Container>
            </div>
        );
    }
}

export default ScanResults;