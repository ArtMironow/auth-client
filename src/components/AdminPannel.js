import React, { useEffect, useState } from "react";
import AuthService from "../services/auth.service";
import Spinner from "react-bootstrap/Spinner";

const AdminPannel = () => {
  const [content, setContent] = useState([]);

  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    setShowSpinner(true);
    const fetchData = async () => {
      const response = await AuthService.getAllUsers();
      setContent(response.data);
      setShowSpinner(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <br></br>
      {showSpinner === false ? (
        <>
          {content ? (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Id</th>
                  <th scope="col">Nickname</th>
                  <th scope="col">Email</th>
                </tr>
              </thead>
              <tbody>
                {content.map((user, i) => (
                  <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td>{user.id}</td>
                    <td>{user.nickname}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h2>There are no users</h2>
          )}
        </>
      ) : (
        <div className="spinner">
          <Spinner animation="border" role="status"></Spinner>
          <span>Loading . . . </span>
        </div>
      )}
    </>
  );
};

export default AdminPannel;
