import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNum, setNewNum] = useState('');
  const [filterText, setFilterText] = useState('');
  
  //get every person
  useEffect(() => {
    axios.get('https://phonebook-backend-ilkh.onrender.com/api/persons')
      .then((response) => {
        setPersons(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  //update or post
  const handleSubmit = (e) => {
    e.preventDefault();

    //update person
    const existingPerson = persons.find(person => person.name === newName)

    if(existingPerson) {
      const confirmed = window.confirm(`${newName} is already in the phonebook. Do you want to update the number?`)

      if(confirmed) {
        const updatedPerson = { ...existingPerson, number: newNum}
        axios.put(`https://phonebook-backend-ilkh.onrender.com/api/persons/${existingPerson.id}`, updatedPerson)
        .then(response => {
          const updatedPersons = persons.map(person =>
            person.id === existingPerson.id ? response.data : person
          );
          setPersons(updatedPersons);
          alert('Contact updated in the phonebook!');
        })
        .catch(error => console.log('PUT request unsuccessful', error));
      }
    } else {
      //create new person
      const newData = { name: newName, number: newNum };
       axios.post('https://phonebook-backend-ilkh.onrender.com/api/persons', newData)
         .then(response => {
           setPersons([...persons, response.data]);
           alert('New contact added to the phonebook!');
        })
        .catch(error => console.log('POST request unsuccessful', error));
    }
    //clear input fields
    setNewName('');
    setNewNum('');
  };

  //delete person
  const remove = (event, id, name) => {
    event.preventDefault();
    const confirmed = window.confirm(`Are you sure you want to delete ${name}?`);

    if (confirmed) {
      axios.delete(`https://phonebook-backend-ilkh.onrender.com/api/persons/${id}`)
        .then(response => {
          console.log(`Contact with ${id} has been deleted`);
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          console.log('DELETE request unsuccessful', error);
        });
    }
  };

  const filteredPersons = persons.filter(person =>
    person.name && person.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      <h1>Phonebook</h1>
      <form onSubmit={handleSubmit}>
        <h2>Display</h2>

        Filter and modify phonebook:
        <input
          type='text'
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        {filterText ? filteredPersons.map((person) => (
          <p key={person.id}>
            {person.name} <span>{person.number}</span>{' '}
            <button onClick={(event) => remove(event, person.id, person.name)}>delete</button>
          </p>
        )) : ''}

        <h2>Add new contacts</h2>
        <div style={{ display: 'flex', flexDirection: 'column', width: '40%' }}>
          name: <input type='text' value={newName} onChange={(e) => setNewName(e.target.value)} />
          number: <input type='number' value={newNum} onChange={(e) => setNewNum(e.target.value)} />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>

      <h2>Contacts</h2>
      {persons.map((person) => (
        <p key={person.id}>{person.name} <span>{person.number}</span></p>
      ))}
    </div>
  );
};

export default App;



