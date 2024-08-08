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
  const [contact, setContact] = useState({});
  const [updates, setUpdates] = useState({});
  const [history, setHistory] = useState([]);
  const [listening, setListening] = useState(false);
  const [curContact, setCurContact] = useState({});
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
          console.error('error from catch:', err)
          alert('Something went wrong!', err.message);
        })
        .finally(()=> {
          setIsProcessing(false)
        })
    } else {
      axios.put(`/api/contacts/${curContact.id}`, curContact).then(res => {
        if (res.status >= 200 && res.status < 400) {
          setContact(res.data.contact);
          setCurContact(res.data.contact);
          if (listening) {
            setUpdates(res.data.contact);
          }
          alert('Update successful!');
        }
        setEditing(false)
        setIsProcessing(false)
      })
        .catch(err => {
          setIsLoading(false)
          alert('Update failed', err.message);
          console.error(err)
        })
        .finally(()=>{
          setIsProcessing(false)
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

/*------------- useEffect -----------------------*/

  useEffect(() => {
    const controller = new AbortController();
    axios.get(`/api/contacts/${urlParam}`, controller.signal).then((res) => {
      setContact(res.data);
      setCurContact(res.data);
    }).then( () => {
      if (!isCreate) {
        axios.get(`/api/contacts/${urlParam}/history`, controller.signal).then(res => {
          setHistory(res.data)
        })
      }
    }).then(()=> {
      setIsLoading(false);
    })
      .catch(console.error);


    return () => {
      controller?.abort();
    }
  }, []);

  useEffect(() => {
    let events;
    if (!listening){
      events = new EventSource('http://localhost:3000/api/events');

      events.onmessage = event => {
        let evData;
        const parsedData = JSON.parse(event.data);
        if (Array.isArray(parsedData)) evData = parsedData.pop();
        if (evData?.id) {
          setUpdates(evData);

          if (evData.id === contact.id) {
            setHistory(h => [...h, evData]);
          }
         console.log('Event triggered: ', {data: evData})
        }

        setUpdates(evData);
      };
      setListening(true);
    }

  },[listening, updates]);


  /* ---------------------- end - useEffect-----------------------  */

  const inputTypes = [
    {type: 'text', name: 'first_name', label: 'First Name', maxLength: 35, readOnly: !editing && !isCreate, required: true},
    {type: 'text', name: 'last_name', label: 'Last Name', maxLength: 35, readOnly: !editing && !isCreate, required: true},
    {type: 'email', name: 'email', label: 'Email', maxLength: 254, readOnly: !editing && !isCreate, required: true},
    {type: 'tel', name: 'phone', label: 'Phone', maxLength: 10, readOnly: !editing && !isCreate, required: true},
  ]

  const formatJSONHistory = (his) => {
    const history = JSON.parse(his)
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
              !isLoading && inputTypes.map(t => FormInput({
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
              <button type='submit' className={isProcessing ? 'button-processing' : null} disabled={isProcessing || !editing && !isCreate}><span>{isProcessing
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
              {history?.length ? history.map(c => <li key={c.id}>{formatJSONHistory(c?.changes)}</li>) : <p>empty history</p>}
            </ol>}
          </div>
        </div>}
      </div>
    </>
  )
}

export default Contact;