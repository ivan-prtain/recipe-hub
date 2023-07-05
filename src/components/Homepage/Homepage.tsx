import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import Modal from '../Modal/Modal';
import AddRecipe from '../AddRecipe/AddRecipeForm';
import { RecipeToAddType } from '../AddRecipe/AddRecipeForm';
import foodImage from '../../assets/images/food-default.jpg';
import coverImage from "../../assets/images/spaghetti.jpg"

import "./Homepage.css"

export type RecipeRequestFormatType = {
    recipe: {
        authorId: string,
        dateCreated: string,
        instructions: string[]
        tags: string[]
        title: string
    }
}

type RecipeType = {
    authorId: string,
    dateCreated: string,
    id: string
    instructions: string[]
    tags: string[]
    title: string
}


const Homepage = () => {

    const navigate = useNavigate()
    const [allRecipes, setAllRecipes] = useState<RecipeType[]>([])
    const [recipes, setRecipes] = useState<RecipeType[]>([])
    const [searchValue, setSearchValue] = useState('')
    const [isSubmittingRecipe, setIsSubmittingRecipe] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)


    const fetchRecipes = async () => {
        try {
            const response = await fetch(`/get-recipes`, {
                method: 'GET',
                headers: {
                    authid: 'B03oPhAgezge1BbO8eWNwncfV4u1',
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            /*      console.log("recipes")
                 console.log(data.recipes) */
            setAllRecipes(data.recipes)
            setRecipes(data.recipes)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchRecipes()
    }, [])



    const handleRecipeClick = (id: string) => {
        navigate(`/recipe-details/${id}`)
    }

    const handleSearch = () => {
        const filteredRecipes = allRecipes.filter((recipe) => {
            return recipe.title.toLowerCase().includes(searchValue.toLowerCase())
        })

        setRecipes(filteredRecipes)
    }

    const onModalClose = () => {
        setIsModalOpen(false)
    }

    /*     console.log({ searchValue }) */


    const addRecipe = async (recipe: RecipeToAddType) => {
        console.log(recipe)
        const recipeToAdd = {
            recipe: recipe
        }
        setIsSubmittingRecipe(true)
        try {
            const response = await fetch(`/add-recipe`, {
                method: 'POST',
                headers: {
                    authid: 'B03oPhAgezge1BbO8eWNwncfV4u1',
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(recipeToAdd)
            })

            if (response.status === 200) {
                fetchRecipes()
                setIsModalOpen(false)

            }

        } catch (error) {
            console.log(error)

        } finally {
            setIsSubmittingRecipe(false)
        }
    }

    const handleSearchKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleSearch()
        }
    }


    return (
        <div className='main-wrapper'>
            <div className='header'>
                <h1>Tasty Recipes</h1>
                <div>
                    <input onKeyDown={handleSearchKeyDown} placeholder='search' onChange={(e) => setSearchValue(e.target.value)} />
                    <button onClick={handleSearch}>Search</button>
                </div>
                <div>
                    <button onClick={() => setIsModalOpen(true)}>Add Recipe</button>
                </div>
            </div>
            {recipes.length > 0 ?
                <div className='recipes-collection' >

                    {recipes.map((recipe) => (
                        <div key={recipe.id} className='recipe' onClick={() => handleRecipeClick(recipe.id)}>
                            <div className='recipe-thumbnail'>
                                <img src={foodImage} alt='image of food in bowl' />
                            </div>
                            <div className='recipe-content'>
                                <div className='recipe-title-area'>

                                    <h3 className='recipe-title'>{recipe.title}:</h3>
                                    <span>{recipe.dateCreated}</span>
                                </div>
                                <ul className='instructions'>
                                    {recipe.tags.map((tag) => (
                                        <li>{tag}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
                :
                <div className='no-recipes'></div>

            }

            <Modal isOpen={isModalOpen} onClose={onModalClose}>
                {isSubmittingRecipe ? <p>Adding recipe...</p> : <AddRecipe onSubmit={addRecipe} />}
            </Modal>

        </div>

    )
}

export default Homepage