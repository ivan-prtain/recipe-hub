import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

import "./Homepage.css"

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
    const [recipes, setRecipes] = useState<RecipeType[]>([])

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
            console.log("recipes")
            console.log(data.recipes)
            setRecipes(data.recipes)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchRecipes()
    }, [])

    console.log(typeof recipes)

    const handleRecipeClick = (id: string) => {
        navigate(`/recipe-details/${id}`)
    }

    return (
        <div className='main-wrapper'>
            <h1>Homepage</h1>
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

        </div>

    )
}

export default Homepage