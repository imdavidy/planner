/**
 * Contact component module.
 * @module /components/Contact
 *
 */
import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";
import axios from "axios";
import utils from '../../util/utils.mjs'

const Contact = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [contact, setContact] = useState(location.state);
  const [curContact, setCurContact] = useState({...contact});
  const [isCreate, setIsCreate] = useState(location.pathname === '/contact' );
  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const urlParam = utils.getParam({url: location.pathname, pre: 'contacts'})
  const handleChange = e => {
    e.preventDefault();
    const {name, value} = e.target;
    let filteredValue = value || '';

    if (e.target.type === 'tel') {
      const regex = new RegExp(`[0-9]{1,${+e.target?.maxLength}}`)
      filteredValue = value?.match(regex)?.[0]
    } else {
      filteredValue = value.trim()
    }
    setCurContact({...curContact, [name]: filteredValue});
  }

  const handleSubmit = e => {
    // make post req
    e.preventDefault();
    setIsProcessing(true);
    if (isCreate) {
      axios.post('/api/contact', curContact).then((res) => {
        if (res.status >= 200 && res.status < 400) {
          setContact(res.data.contact);
          setIsCreate(false);
          alert('New contact is successfully created!');
          return res;
        }
      })
        .then(res => {
          setContact(res.data.contact);
          setCurContact(res.data.contact);
          navigate('/contacts/'+res.data.contact.id, {state: res.data.contact});
        })
        .catch(err => {
          setIsLoading(false)
          console.error(err)
        })
        .finally(()=> {
          setIsProcessing(false)
        })
    } else {
      axios.put(`/api/contacts/${curContact.id}`, curContact).then(res => {
        if (res.status >= 200 && res.status < 400) {
          setContact(res.data.contact);
          alert('Update successful!');
        }
        setEditing(false)
        setIsProcessing(false)
        navigate('/contacts/'+res.data.contact.id, {state: contact});
      })
        .catch(err => {
          setIsLoading(false)
          console.error(err)
        })
        .finally(()=>{
          setIsProcessing(false)
          navigate('/contacts/'+curContact.id);
        })
    }
  };

  const cancelEdit = () => {
    setCurContact({...contact})
    setEditing(!editing)
    // setIsLoading(true)
  }

  const FormInput = (props) => {
    return <div className="form-textbox" key={props.type + props.name}>
      <input type={props.type}
             name={props.name}
             value={props.data[props.name] || ''}
        // onInput={props.type === 'tel' ? props.onChange : null}
        // onChange={props.type !== 'tel' ? props.onChange : null}
             maxLength={props.maxLength}
             onChange={props.onChange}
             readOnly={props.readOnly}
             required={props.required}/>
      <span>
        {props.label}
      </span>
      <span></span>
    </div>
  }

  useEffect(() => {
    if (!isCreate) {
      axios.get(`/api/contacts/${urlParam}/history`).then(res => {
        setContact(pre => ({...pre, editHistory: res.data}));
        setCurContact(pre => ({...pre, editHistory: res.data}));
        setIsLoading(false);
      })
    }
  }, [isProcessing]);
  const inputTypes = [
    {type: 'text', name: 'first_name', label: 'First Name', maxLength: 35, readOnly: !editing && !isCreate, required: true},
    {type: 'text', name: 'last_name', label: 'Last Name', maxLength: 35, readOnly: !editing && !isCreate, required: true},
    {type: 'email', name: 'email', label: 'Email', maxLength: 254, readOnly: !editing && !isCreate, required: true},
    {type: 'tel', name: 'phone', label: 'Phone', maxLength: 10, readOnly: !editing && !isCreate, required: true},
  ]

  const formatJSONHistory = (jsonh) => {
    const history = JSON.parse(jsonh)
    const keyVals = [];
    const targetProps = ['first_name', 'last_name', 'phone', 'email', 'updatedAt'];
    for(const key in history) {
      if (targetProps.includes(key)) {
        if (key === 'updatedAt') {
          let newDate = new Date(history[key]);
          let formattedDate = newDate.toLocaleDateString() + ' ' + newDate.toLocaleTimeString();
          keyVals.push(`${key}: ${formattedDate}`)
        } else {
          keyVals.push(`${key}: ${history[key]}`);
        }
      }
    }
    return keyVals.join('; ');
  }

  return (
    <>
      <div className='layout-container'>
        <div className="contact-detail-container">
          <div>
            <h5>Details:</h5>
          </div>
          <form className={'contact-form-container'} onSubmit={handleSubmit}>
            {
              inputTypes.map(t => FormInput({
                data: curContact,
                type: t.type,
                name: t.name,
                label: t.label,
                readOnly: t.readOnly,
                maxLength: t.maxLength,
                onChange: handleChange,
                required: t.required
              }))
            }
            <div className='form-button-container'>
              {!isCreate && <button type="button" onClick={() => {editing ? cancelEdit() : setEditing(!editing)}}>{editing
                ? 'Cancel'
                : 'Edit'}</button>}
              <button type='submit' className={'elementToFadeInAndOut'} disabled={isProcessing || !editing && !isCreate}><span>{isProcessing
                ? '...processing'
                : 'Save'}</span></button>
            </div>
          </form>
        </div>
        {!isCreate && <div className="contact-history">
          <h5>Edit History</h5>
          <div className="history-list">
            {isLoading && <p>Loading...</p>}
            {!isLoading && <ol>
              {curContact?.editHistory?.length ? curContact?.editHistory.map(c => <li key={c.id}>{formatJSONHistory(c.changes)}</li>) : <p>empty history</p>}
            </ol>}
          </div>
        </div>}
      </div>
    </>
  )
}

export default Contact;