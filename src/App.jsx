import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNum, setNewNum] = useState('');
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then((response) => {
        setPersons(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // const existingPerson = persons.find(person => person.name === newName);

    // if (existingPerson) {
    //   window.confirm('Are you sure you want to update this contact')
    //   const updatedPerson = { ...existingPerson, number: newNum };
    //   axios.put(`http://localhost:3001/persons/${existingPerson.id}`, updatedPerson)
    //     .then(response => {
    //       const updatedPersons = persons.map(person =>
    //         person.id === existingPerson.id ? response.data : person
    //       );
    //       setPersons(updatedPersons);
    //       alert('Phonebook has been updated with the new number!');
    //     })
    //     .catch(error => console.log('PUT request unsuccessful', error));
    // } else {
    //   const newData = { name: newName, number: newNum };
    //   axios.post('http://localhost:3001/persons', newData)
    //     .then(response => {
    //       setPersons([...persons, response.data]);
    //       alert('New contact added to the phonebook!');
    //     })
    //     .catch(error => console.log('POST request unsuccessful', error));
    // }

    const newData = { name: newName, number: newNum };
       axios.post('http://localhost:3001/persons', newData)
         .then(response => {
           setPersons([...persons, response.data]);
           alert('New contact added to the phonebook!');
         })
         .catch(error => console.log('POST request unsuccessful', error));

    setNewName('');
    setNewNum('');
  };

  const remove = (event, id, name) => {
    event.preventDefault();
    const confirmed = window.confirm(`Are you sure you want to delete ${name}?`);

    if (confirmed) {
      axios.delete(`http://localhost:3001/persons/${id}`)
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



