import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

type RecipeDetailsType = {
    id: string,
    title: string,
    dateCreated: string,
    authorId: string,
    instructions: string[],
    tags: string[]
}

const RecipeDetails = () => {

    const { id } = useParams<{ id: string }>();

    const fetchRecipeDetails = async () => {
        try {
            const response = await fetch(`/get-recipe/?recipeId=${id}`, {
                method: 'GET',
                headers: {
                    authid: 'B03oPhAgezge1BbO8eWNwncfV4u1',
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            console.log("recipefetch")
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchRecipeDetails()
    })

    return (
        <div>RecipeDetails</div>
    )
}

export default RecipeDetails