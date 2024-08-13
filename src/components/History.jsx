import React, { useState, useEffect } from 'react';
import '../App.css';

function History(options ={}) {
  const [ history, setHistory ] = useState(options.data);
  const [ eventHistory, setEventHistory ] = useState([...options.data]);
  const [ listening, setListening ] = useState(false);

  const formatHistory = (his) => {
    const keyVals = [];
    const targetProps = ['first_name', 'last_name', 'phone', 'email', 'updatedAt'];
    for(const key in his) {
      if (targetProps.includes(key)) {
        if (key === 'updatedAt') {
          let newDate = new Date(his[key]);
          let formattedDate = newDate.toLocaleDateString() + ' ' + newDate.toLocaleTimeString();
          keyVals.push(`${key}: ${formattedDate}`)
        } else {
          keyVals.push(`${key}: ${his[key]}`);
        }
      }
    }
    return keyVals.join('; ');
  }

  useEffect( () => {
    if (!listening) {
      const events = new EventSource('http://localhost:3000/api/events');

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        setEventHistory(parsedData);
      };
      setHistory( eventHistory)
      setListening(s => {
        return true
      });
    }
  }, [listening, eventHistory]);

  useEffect(()=>{
    console.log({history, eventHistory})
    setHistory(h=>[...h, eventHistory])

  }, [eventHistory])
  return (
  <div className="contact-history">
    <h5>Edit History</h5>
    <div className="history-list">
      <ol>
        {history.map((c, i) => <li key={i}>{formatHistory(c)}</li>)}
        {history.length === 0 && <p>empty history</p>}
      </ol>
    </div>
  </div>
  );
}

export default History;