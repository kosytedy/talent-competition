import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Card, Grid } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        //this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData: {isLoading: false, allowedUsers: []} })
        )
        
        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        var {loadJobs, activePage, sortBy, filter} = this.state;
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');

        
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType:'json',
            data: {
                activePage: activePage,
                sortByDate: sortBy.date,
                showActive: filter.showActive,
                showClosed: filter.showClosed,
                showDraft: filter.showDraft,
                showExpired: filter.showExpired,
                showUnexpired: filter.showUnexpired
            },
            success: function (res) {
                this.setState({loadJobs: res.myJobs})
                //console.log(res);
                callback();
            }.bind(this),
            error: function (res) {
                TalentUtil.notification.show("Error listing jobs", "error", null, null);
                callback();
            }.bind(this)
        })
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    render() {
        var { loadJobs, loaderData, activePage, totalPages } = this.state;
        const filterOptions = [
            {
                key: '0',
                text: 'Choose filter',
                value: 'Choose filter',
                content: 'Choose filter',
            }
        ]
        const sortOptions = [
            {
                key: '0',
                text: 'Newest first',
                value: 'desc',
                content: 'Newest first',
            },
            {
                key: '1',
                text: 'Oldest first',
                value: 'asc',
                content: 'Oldest first',
            }
        ] 
        return (
            <BodyWrapper reload={this.init} loaderData={loaderData}>
               <div className ="ui container">
                   <h3>List of Jobs</h3>
                   <Form>
                        <Form.Group inline>
                            <Icon name='filter' />Filter: {' '}
                            <Dropdown inline options={filterOptions} defaultValue={filterOptions[0].value}>
                            </Dropdown>
                            <Icon name='calendar' /> Sort by date: {' '}
                            <Dropdown inline options={sortOptions} defaultValue={sortOptions[0].value}>
                            </Dropdown>
                        </Form.Group>
                    </Form>
                    <Card.Group>
                    {
                        (loadJobs.length > 0) 
                        ? loadJobs.map(job => {
                            return (
                                <JobSummaryCard key={job.id} job={job} />
                            )
                        })
                         : 'No Jobs Found'
                    }
                    </Card.Group>
                    <Grid centered>
                        <Grid.Column textAlign='center'>
                            <Pagination defaultActivePage={activePage} totalPages={totalPages} />
                        </Grid.Column>
                    </Grid>
               </div>
            </BodyWrapper>
        )
    }
}