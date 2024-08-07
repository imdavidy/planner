/**
 * Contact component module.
 * @module /components/ContactList
 *
 */

// src/components/ContactList.js
import {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import deleteIcon from '/delete-icon.svg'

const ContactList = () => {

  const [contacts, setContacts] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const updateContacts = (name, value) => {
    setContacts(current => {
      return ({
        ...current,
        [name]: value,
      })});
  };

  const onClick = (e, id) => {
    e.preventDefault();
    console.log({e, id})
    axios.delete(`/api/contacts/${id}`)
      .then(res=> {
        if (res.status >= 200 && res.status < 400) {
          setIsLoading(true);
          alert('Successfully Removed');
        }
      })
      .catch(console.error);
  }

  useEffect(() => {
    axios.get('/api/contacts')
      .then(res => {
      setContacts(res.data);
      setIsLoading(false);
    })
      .catch(console.error);
  }, [isLoading]);

  return (
    <div className="layout-container">
      <div className="list-heading">
        <div>
          <h2>Contact List</h2>
        </div>
        <div>
          <Link to="/contact">+ Add Contact</Link>
        </div>
      </div>
      <div className="contact-list">
        {!isLoading &&
          <ul>
            {contacts.map((contact) => (
              <li key={contact.email}><Link to={`${contact.id}`} state={contact}>{contact.first_name} {contact.last_name}</Link>
                <img className={'delete-icon'} onClick={e=> onClick(e,contact.id)} src={deleteIcon} alt='delete icon'/>
              </li>
            ))}
          </ul>
        }
        {isLoading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default ContactList;
