import React, { useState, useEffect } from "react";
import Axios from "axios";

export default function Item({ data, items, setItems }) {
  const { _id, name, done } = data;
  const [check, setCheck] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updatedValue, setUpdatedValue] = useState("");

  useEffect(() => {
    setCheck(done);
    setUpdatedValue(name);
  }, [done, name]);
  const handleCheck = async () => {
    try {
      await Axios.patch(
        `https://damp-tor-09237.herokuapp.com/api/v1/items/${_id}`,
        {
          done: !check,
        }
      );
      const updatedItems = items.map((item) =>
        item._id === _id ? { ...item, done: !check } : item
      );
      setCheck(!check);
      setItems(updatedItems);
      console.log(updatedItems);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = async () => {
    try {
      await Axios.delete(
        `https://damp-tor-09237.herokuapp.com/api/v1/items/${_id}`
      );
      const updatedItems = items.filter((item) => item._id !== _id);

      setItems(updatedItems);
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpdateName = async () => {
    try {
      await Axios.patch(
        `https://damp-tor-09237.herokuapp.com/api/v1/items/${_id}`,
        {
          name: updatedValue,
        }
      );
      const updatedItems = items.map((item) =>
        item._id === _id ? { ...item, name: updatedValue } : item
      );

      setItems(updatedItems);
      setUpdating(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <li className="list-group-item d-flex align-items-center justify-content-between">
        {!updating ? (
          done ? (
            <strike>{name}</strike>
          ) : (
            name
          )
        ) : (
          <input
            className="form-control inline-form-control"
            value={updatedValue}
            onChange={(e) => setUpdatedValue(e.currentTarget.value)}
          />
        )}

        <div className={`${!updating ? "d-none" : ""}`}>
          <button className="btn btn-success" onClick={handleUpdateName}>
            update
          </button>
        </div>

        <div className={`${updating ? "d-none" : ""}`}>
          <button className="btn btn-link btn-sm ">
            <input type="checkbox" onChange={handleCheck} checked={check} />
          </button>
          <button
            className="btn btn-link btn-sm "
            onClick={() => setUpdating(!updating)}
          >
            <i className="fas fa-edit  text-dark"></i>
          </button>
          <button className="btn btn-link btn-sm " onClick={handleDelete}>
            <i className="fas fa-trash  text-danger"></i>
          </button>
        </div>
      </li>
    </div>
  );
}
