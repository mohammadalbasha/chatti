import { gql } from "@apollo/client";
import { Modal, Button, Pagination } from "flowbite-react";
import React, { useContext, useEffect, useState } from "react";
import apolloClient from "../../services/graphql/graphql-client";
import AuthContext from "../../store/auth-context";
import { useDispatch } from "react-redux";
import { addPrivateConversation } from "../../store/redux/actions/conversation-action";

export function AddFriend({ openModal, setOpenModal }) {
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page) => setCurrentPage(page);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const listUsers = async () => {
      const ListUnAddedUsers = gql`
        query ListUnAddedUsers($listUnAddedUsersArgs: ListUnAddedUsers) {
          listUnAddedUsers(args: $listUnAddedUsersArgs) {
            name
            _id
          }
        }
      `;

      try {
        const result = await apolloClient.query({
          query: ListUnAddedUsers,
          variables: {
            listUnAddedUsersArgs: {
              pagination: {
                limit: 10,
                skip: (currentPage - 1) * 10,
              },
            },
          },
        });

        console.log(result?.data?.listUnAddedUsers);
        setUsers(result?.data?.listUnAddedUsers);
      } catch (err) {
        console.log(err);
      }
    };

    listUsers();
  }, [currentPage]);

  const addUserHandler = (invitedId) => {
    console.log(invitedId, authCtx.profile.id);

    dispatch(
      addPrivateConversation({ invitedId, inviterId: authCtx.profile.id })
    );
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Add a Friend</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          {users.map((user) => {
            return (
              <div className="flex justify-between text-base leading-relaxed text-gray-500 dark:text-gray-400">
                <h4>{user.name}</h4>
                <Button
                  onClick={() => {
                    addUserHandler(user._id);
                  }}
                >
                  Add
                </Button>
              </div>
            );
          })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setOpenModal(false)}>Close</Button>
        <div className="flex overflow-x-auto sm:justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={100}
            onPageChange={onPageChange}
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
}
