import React, { useEffect, useState } from "react";
import Axios from "axios";

import Item from "./components/Item";

function App() {
  const [items, setItems] = useState([]);

  const [search, setSearch] = useState("");
  const [itemsDetails, setItemDetails] = useState({});
  const [validationText, setValidationText] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await Axios.get(
        "https://damp-tor-09237.herokuapp.com/api/v1/items/"
      );

      const resItems = res.data.data.docs;
      setItemDetails({
        all: res.data.all,
        results: res.data.results,
      });
      setItems(resItems);
    })();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      if (!validationText) {
        const res = await Axios.post(
          "https://damp-tor-09237.herokuapp.com/api/v1/items/",
          {
            name: search,
          }
        );
        const item = res.data.data;
        setItems([item, ...items]);
        setSearch("");
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearchText = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.length === 0) {
      setValidationText("Please don't write an empty item.");
    } else if (e.target.value.length < 4) {
      setValidationText("The minimum length is 4 characters");
    } else {
      setValidationText("");
    }
  };

  const goTo = async (page) => {
    const res = await Axios.get(
      `https://damp-tor-09237.herokuapp.com/api/v1/items?page=${page}`
    );

    const resItems = res.data.data.docs;
    setItemDetails({
      all: res.data.all,
      results: res.data.results,
    });
    setItems(resItems);
  };

  return (
    <div className="mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <h1 className="h3 text-center mb-4">
              <i className="fas fa-list"></i> To do list
            </h1>
            <div className="input-group mb-0">
              <input
                type="text"
                value={search}
                onChange={handleSearchText}
                className="form-control"
                placeholder="Search item"
                aria-label="Search item"
                aria-describedby="basic-addon2"
              />
              <div className="input-group-append">
                <button
                  onClick={handleAddItem}
                  className="btn btn-outline-secondary"
                  type="button"
                  disabled={validationText}
                >
                  Add item
                </button>
              </div>
            </div>
            <div className="text-danger">{validationText}</div>
            <nav aria-label="Page navigation example" className="my-4">
              <ul className="pagination">
                {itemsDetails &&
                  itemsDetails.all &&
                  itemsDetails.results &&
                  Array(Math.ceil(itemsDetails.all / 5))
                    .fill()
                    .map((num, index) => (
                      <li className="page-item">
                        <a
                          className="page-link"
                          href={index + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            goTo(index + 1);
                          }}
                        >
                          {index + 1}
                        </a>
                      </li>
                    ))}
              </ul>
            </nav>
            <ul className="list-group mt-4">
              {items &&
                items
                  .filter((item) => item.name.includes(search))
                  .map((item) => (
                    <Item
                      items={items}
                      setItems={setItems}
                      data={item}
                      key={item._id}
                    />
                  ))}
              {items.length === 0 && search.length === 0 ? (
                <h3 className="text-center">
                  Empty list , create new items ✍
                </h3>
              ) : (
                ""
              )}
            </ul>
          </div>
          <div className="col-md-3"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
