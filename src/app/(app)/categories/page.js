'use client'
import { Layout } from '@/components'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { withSwal } from 'react-sweetalert2'

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null)
  const [name, setName] = useState('')
  const [parentCategory, setParentCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [properties, setProperties] = useState([])
// so that category is fetched immediately when the page is load
  useEffect(() => {
    fetchCategories()
  }, [])
//this is the funtion to fetch the categories 
  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data.category)
    }).catch(err => {
      console.error('Failed to fetch categories:', err);
    });
  }
// this the function to save the category
  async function saveCategory(e) {
    e.preventDefault(); //preventing default opertion of the funct
    const data = { //creating obj 
      name,
      parentCategory,
      properties: properties.map(p => ({
        name: p.name,
        values: p.values.split(','),
      })),
    };

    try {
      if (editedCategory) { //if edit category module is open
        data._id = editedCategory._id;
        await axios.put('/api/categories', data); //updating the category in the db
        setEditedCategory(null) //closing the edit module
      } else {
        await axios.post('/api/categories', data) // saving the new category 
      }
      //setting all the values to default
      setName('');
      setParentCategory('');
      setProperties([]);
      fetchCategories();
    } catch (err) {
      console.error('Failed to save category:', err);
      swal.fire({
        title: 'Error',
        text: 'Failed to save category.',
        icon: 'error',
      });
    }
  }
// the function to edit category
  async function editCategory(category) {
    //setting values of the category which needs to be edited
    setEditedCategory(category); 
    setName(category.name);
    setParentCategory(category.parent?._id || '');//incase there is no parent category
    setProperties(category.properties.map(({ name, values }) => ({ // setting all the properties one by one
      name,
      values: values.join(','),
    })));
  }
// function to delete category
  function deleteCategory(category) {
    //dialog box for confgirmation 
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      //if the result is confirmed
      if (result.isConfirmed) {
        try {
          //deleting category from the db
          await axios.delete(`/api/categories?id=${category._id}`);
          fetchCategories();//fetch the updated categories
        } catch (err) {
          console.error('Failed to delete category:', err);
          swal.fire({
            title: 'Error',
            text: 'Failed to delete category.',
            icon: 'error',
          });
        }
      }
    });
  }
// handling the property name change
  function handlePropertyNameChange(index, property, newName) {
    setProperties(prev => {// assessing the prev proprties
      const properties = [...prev]; //speading it to an array
      properties[index].name = newName; //changing the property name on the given index
      return properties; //returnng the proeprty
    });
  }
// to handle add property
  function addProperty() {
    // useState set func also provides callback 
    setProperties(prev => [...prev, { name: '', values: '' }]); // spreading the array and adding new element
  }
// handling the property value change
  function handlePropertyValuesChange(index, property, newValues) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }
// to handle remove property
  function removeProperty(indexToRemove) {
    //filtering the property and by checking through the test
    setProperties(prev => prev.filter((_, pIndex) => pIndex !== indexToRemove));
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory ? `Edit category ${editedCategory.name}` : 'Create new category'}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category name"
            onChange={ev => setName(ev.target.value)}
            value={name}
          />
          <select
            onChange={ev => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option value="">No parent category</option>
            {categories.length > 0 && categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2"
          >
            Add new property
          </button>
          {properties.length > 0 && properties.map((property, index) => (
            <div key={index} className="flex gap-1 mb-2">
              <input
                type="text"
                className="mb-0"
                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                value={property.name}
                placeholder="property name (example: color)"
              />
              <input
                type="text"
                className="mb-0"
                onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)}
                value={property.values}
                placeholder="values, comma separated"
              />
              <button
                onClick={() => removeProperty(index)}
                type="button"
                className="btn-red"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
                setProperties([]);
              }}
              className="btn-default"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 && categories.map(category => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name || 'No parent'}</td>
                <td>
                  <button
                    onClick={() => editCategory(category)}
                    className="btn-default mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category)}
                    className="btn-red"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  )
}
//high order function to give props to the categories component
export default withSwal(({ swal }, ref) => (
  <Categories swal={swal} />
));
