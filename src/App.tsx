import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Accordion } from 'react-bootstrap';
import axios from 'axios';
import './App.css';

interface User {
  id: number;
  name: string;
  following: any;
  interests: any;
}

interface Interested {
  id: number;
  name: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [interested, setInterested] = useState<any[]>([]);
  const [counts, setCounts] = useState<any>({});

  useEffect(() => {
    axios.get<User, any>('./users.json').then((response) => {
      setUsers(response.data);
    });

    axios.get<Interested, any>('./interests.json').then((response) => {
      console.log('response in', response.data);
      setInterested(response.data);
    });

    const handleFollowersCount = () => {
      const followes = users.map((user: User) => user.following);
      const merged = [].concat.apply([], followes);
      const counts: any = {};
      merged.map(function (x) {
        return (counts[x] = (counts[x] || 0) + 1);
      });
      setCounts(counts);
    };
    handleFollowersCount();
    // eslint-disable-next-line
  }, []);

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user: User) => user.id !== id));
  };

  const handleDeleteInterest = (userId: number, interestId: number) => {
    const removed = users.filter((user: User) => user.id === userId);
    // eslint-disable-next-line
    removed[0].interests.map((id: number, $index: number) => {
      if (id === interestId) {
        removed[0].interests.splice($index, 1);
      }
    });
    setUsers(users.map((user: User) => user));
  };

  return (
    <div className='App mt-5'>
      <Container>
        {users &&
          users
            ?.sort((a: User, b: User) =>
              a.following.length < b.following.length ? 1 : -1
            )
            .map((user: User) => (
              <Row className='mb-3' key={user.id}>
                <Col xs={6}>
                  <Accordion>
                    <Accordion.Item eventKey='0'>
                      <Accordion.Header>
                        {user.name} has {counts[user.id] || 0} followers
                      </Accordion.Header>
                      {user.interests && (
                        <Accordion.Body>
                          interests :{' '}
                          {user?.interests?.map(
                            (interest: any, index: number) => (
                              <li key={index}>
                                {interested[interest - 1]?.name}
                                <svg
                                  onClick={() =>
                                    handleDeleteInterest(user.id, interest)
                                  }
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='16'
                                  height='16'
                                  fill='red'
                                  className='bi bi-trash ml-1'
                                  viewBox='0 0 16 16'
                                >
                                  <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
                                  <path
                                    fillRule='evenodd'
                                    d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'
                                  />
                                </svg>
                              </li>
                            )
                          )}
                        </Accordion.Body>
                      )}
                    </Accordion.Item>
                  </Accordion>
                </Col>
                <Col xs={1} className='d-flex align-items-center'>
                  <svg
                    onClick={() => handleDeleteUser(user.id)}
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    fill='red'
                    className='bi bi-trash'
                    viewBox='0 0 16 16'
                  >
                    <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
                    <path
                      fillRule='evenodd'
                      d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'
                    />
                  </svg>
                </Col>
              </Row>
            ))}
      </Container>
    </div>
  );
};

export default App;
