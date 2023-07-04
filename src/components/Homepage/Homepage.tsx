import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import Modal from '../Modal/Modal';
import AddRecipe from '../AddRecipe/AddRecipeForm';

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


    const addRecipe = async (recipe: RecipeRequestFormatType) => {
        setIsSubmittingRecipe(true)
        try {
            const response = await fetch(`/add-recipe`, {
                method: 'POST',
                headers: {
                    authid: 'B03oPhAgezge1BbO8eWNwncfV4u1',
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(recipe)
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


    return (
        <div className='main-wrapper'>
            <h1>Homepage</h1>
            <div>
                <input placeholder='search' onChange={(e) => setSearchValue(e.target.value)} />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div>
                <button onClick={() => setIsModalOpen(true)}>Add Recipe</button>
            </div>
            {recipes.map((recipe) => (
                <div key={recipe.id} className='recipe' onClick={() => handleRecipeClick(recipe.id)}>
                    <span>{recipe.dateCreated}</span>
                    <span>{recipe.title}:</span>
                    <span className='instructions'>
                        {recipe.instructions.map((instruction) => (
                            <span key={instruction}>{instruction}</span>
                        ))}
                    </span>
                </div>
            ))}

            <Modal isOpen={isModalOpen} onClose={onModalClose}>
                {isSubmittingRecipe ? <p>Adding recipe...</p> : <AddRecipe addRecipe={addRecipe} />}
            </Modal>

        </div>

    )
}

export default Homepage