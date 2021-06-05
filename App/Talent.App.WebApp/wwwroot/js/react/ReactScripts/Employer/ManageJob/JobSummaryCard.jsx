import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Label, Card, Button } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        //url: 'http://localhost:51689/listing/listing/closeJob',
    }

    componentDidMount(){
        //console.log(this.props.jobsList)
    }

    render() {
        var { job } = this.props;
        return (
            <Card key={job.id}>
                <Card.Content>
                    <Card.Header>{job.title}</Card.Header>
                    <Label as='a' color='black' ribbon='right'><i className="user icon"></i>{job.noOfSuggestions} </Label>
                    <Card.Meta>{job.location.city}, {job.location.country}.</Card.Meta>
                    <Card.Description>
                        {job.summary}
                    </Card.Description>
                </Card.Content>

                <Card.Content extra>
                    {
                        moment().isAfter(job.expiryDate) && <Button size='mini' content="Expired" color='red' floated="left" />
                    }
                    
                    <Button.Group size='mini' floated='right'>
                        <Button content="Close" icon="ban" basic color='blue' />
                        <Button content="Edit" icon="edit" basic color='blue' />
                        <Button content="Copy" icon="copy" basic color='blue' />
                    </Button.Group>
                </Card.Content>
            </Card>
        )
    }
}