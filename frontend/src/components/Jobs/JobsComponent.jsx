
import React, { Component } from 'react';
import {Table, IconButton, Icon} from "rsuite";
import mockdata from "./MOCK_DATA.json";
import NavBarComponent from "./../common/NavBar";


const { Column, HeaderCell, Cell, Pagination } = Table;

const rowKey = 'id';
const ExpandCell = ({ rowData, dataKey, expandedRowKeys, onChange, ...props }) => (
  <Cell {...props}>
    <IconButton
      size="xs"
      appearance="subtle"
      onClick={() => {
        onChange(rowData);
      }}
      icon={
        <Icon
          icon={
            expandedRowKeys.some(key => key === rowData[rowKey])
              ? 'minus-square-o'
              : 'plus-square-o'
          }
        />
      }
    />
  </Cell>
);


class JobsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            data: mockdata,
            expandedRowKeys: [],
            displayLength: 10,
            loading: false,
            page: 1
        };
        
        this.handleExpanded = this.handleExpanded.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeLength = this.handleChangeLength.bind(this);
    }
    handleChangePage(dataKey) {
        this.setState({
            page: dataKey
        });
    }
    handleChangeLength(dataKey) {
        this.setState({
            page: 1,
            displayLength: dataKey
        });
    }
    handleExpanded(rowData, dataKey) {
        const { expandedRowKeys } = this.state;
        let open = false;
        const nextExpandedRowKeys = [];

        expandedRowKeys.forEach(key => {
            if (key === rowData[rowKey]) {
                open = true;
            } else {
                nextExpandedRowKeys.push(key);
            }
        });

        if (!open) {
            nextExpandedRowKeys.push(rowData[rowKey]);
        }
        this.setState({
        expandedRowKeys: nextExpandedRowKeys
        });
    }
    getData() {
        const { displayLength, page } = this.state;
    
        return mockdata.filter((v, i) => {
          const start = displayLength * (page - 1);
          const end = start + displayLength;
          return i >= start && i < end;
        });
      }
    render() {
        const { expandedRowKeys } = this.state;
        const data = this.getData();
        const { loading, displayLength, page } = this.state;
        return (
        <div>
            <NavBarComponent {...this.props} />
            <div style={{borderRadius:'10px', backgroundColor: 'white', padding: "10px"}}>
            <Table
                borderRadius={10}
                autoHeight={true}
                data={data}
                loading={loading}
                rowKey={rowKey}
                expandedRowKeys={expandedRowKeys}
                onRowClick={data => {
                console.log(data);
                }}
                renderRowExpanded={rowData => {
                return (
                    <div>
                    <div
                        style={{
                        width: 60,
                        height: 60,
                        float: 'left',
                        marginRight: 10,
                        background: '#eee'
                        }}
                    >
                        <img src={rowData.avatar} style={{ width: 60 }} />
                    </div>
                    <p>{rowData.email}</p>
                    <p>{rowData.date}</p>
                    </div>
                );
                }}
            >
                <Column width={70} align="center">
                <HeaderCell>#</HeaderCell>
                <ExpandCell
                    dataKey="id"
                    expandedRowKeys={expandedRowKeys}
                    onChange={this.handleExpanded}
                />
                </Column>

                <Column width={130}>
                <HeaderCell>First Name</HeaderCell>
                <Cell dataKey="firstName" />
                </Column>

                <Column width={130}>
                <HeaderCell>Last Name</HeaderCell>
                <Cell dataKey="lastName" />
                </Column>

                <Column width={200}>
                <HeaderCell>City</HeaderCell>
                <Cell dataKey="city" />
                </Column>

                <Column width={200}>
                <HeaderCell>Street</HeaderCell>
                <Cell dataKey="street" />
                </Column>

                <Column width={200}>
                <HeaderCell>Company Name</HeaderCell>
                <Cell dataKey="companyName" />
                </Column>
            </Table>
            </div>
            <div style={{backgroundColor: 'white', marginTop: 10, borderRadius: '10px' }}>
                <Pagination
                lengthMenu={[
                    {
                    value: 10,
                    label: 10
                    },
                    {
                    value: 20,
                    label: 20
                    }
                ]}
                activePage={page}
                displayLength={displayLength}
                total={mockdata.length}
                onChangePage={this.handleChangePage}
                onChangeLength={this.handleChangeLength}
                />
            </div>
        </div>
        );
    }
}

export default JobsComponent;