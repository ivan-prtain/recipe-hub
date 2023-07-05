import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../Modal/Modal';
import AddRecipeForm from '../AddRecipe/AddRecipeForm';
import { RecipeToAddType } from '../AddRecipe/AddRecipeForm';
import { useNavigate } from 'react-router-dom';

export type RecipeDetailsType = {
    id: string,
    title: string,
    dateCreated: string,
    authorId: string,
    instructions: string[],
    tags: string[]
}

const RecipeDetails = () => {

    const [isUserRecipeOwner, setIsUserRecipeOwner] = useState(false)
    const [recipeData, setRecipeData] = useState<RecipeDetailsType | undefined>(undefined)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isSavingRecipe, setIsSavingRecipe] = useState(false)
    const navigate = useNavigate()

    const { id } = useParams<{ id: string }>();
    const storedUser = JSON.parse(localStorage.getItem('appUser')!);
    console.log({ storedUser })

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
            setRecipeData(data.recipe)

            if (data.recipe.authorId === storedUser.id) {
                setIsUserRecipeOwner(true)
            }
            console.log("recipefetch")
            console.log(data)

        } catch (error) {
            console.log(error)
        }
    }

    const handleSaveRecipe = async (recipe: RecipeToAddType) => {
        setIsSavingRecipe(true)
        const recipeToSave = {
            recipeId: recipeData?.id,
            recipe: recipe
        }
        try {
            const response = await fetch(`/edit-recipe`, {
                method: 'PUT',
                headers: {
                    authid: 'B03oPhAgezge1BbO8eWNwncfV4u1',
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(recipeToSave)
            })
            if (response.status === 200) {
                setIsEditModalOpen(false)

                fetchRecipeDetails()
            }

        } catch (error) {
            console.log(error)
        } finally {
            setIsSavingRecipe(false)
        }
    }

    const handleDeleteRecipe = async () => {
        try {
            const response = await fetch(`/delete-recipe/?recipeId=${recipeData?.id}`, {
                method: 'DELETE',
                headers: {
                    authid: 'B03oPhAgezge1BbO8eWNwncfV4u1',
                    "Content-Type": "application/json",
                }
            })
            if (response.status === 200) {
                setIsEditModalOpen(false)
                fetchRecipeDetails()
                navigate('/')

            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchRecipeDetails()
    }, [])

    console.log(isUserRecipeOwner)



    return (
        <div>
            <h1>Recipe details</h1>
            <div>
                {isUserRecipeOwner &&
                    <div>
                        <button onClick={() => setIsEditModalOpen(true)}>Edit</button>
                        <button onClick={handleDeleteRecipe}>Delete</button>
                    </div>}
            </div>
            <div>
                <h3>{recipeData?.title}</h3>
                <p>{recipeData?.dateCreated}</p>
                <p>{recipeData?.authorId}</p>
                <div>
                    {recipeData?.instructions.map((instruction) => {
                        return <p>{"-> " + instruction}</p>
                    })}
                </div>
                <p>{recipeData?.tags}</p>
            </div>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                {isSavingRecipe ? <p>Saving...</p> : <AddRecipeForm onSubmit={handleSaveRecipe} editMode={true} editingData={recipeData} />}
            </Modal>
        </div>
    )
}

export default RecipeDetails