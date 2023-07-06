import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../Modal/Modal';
import AddRecipeForm from '../AddRecipe/AddRecipeForm';
import { RecipeToAddType } from '../AddRecipe/AddRecipeForm';
import { useNavigate } from 'react-router-dom';
import { AppUserType } from '../../App';
import { ReactComponent as ChefIcon } from '../../assets/svgs/chef.svg';
import { useCallback } from 'react';

import "./RecipeDetails.css";

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
    const [userData, setUserData] = useState<AppUserType | null>(null)
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>();
    const storedUser = JSON.parse(localStorage.getItem('appUser')!);

    const fetchRecipeDetails = useCallback(async () => {
        try {
            const response = await fetch(`/get-recipe/?recipeId=${id}`, {
                method: 'GET',
                headers: {
                    authid: 'B03oPhAgezge1BbO8eWNwncfV4u1',
                    "Content-Type": "application/json",
                }
            });
            const data = await response.json();
            setRecipeData(data.recipe);

            if (data.recipe.authorId === storedUser.id) {
                setIsUserRecipeOwner(true);
            }
        } catch (error) {
            console.log(error);
        }
    }, [id, storedUser.id]);

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



    const goBack = () => {
        navigate(-1)
    }

    useEffect(() => {
        fetchRecipeDetails()
    }, [fetchRecipeDetails])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/get-user/?appUserId=${recipeData?.authorId}`, {
                    method: 'GET',
                    headers: {
                        authid: 'B03oPhAgezge1BbO8eWNwncfV4u1',
                        "Content-Type": "application/json",
                    }
                })
                const data = await response.json()

                setUserData(data.appUser)
            } catch (error) {
                console.log(error)
            }
        }
        if (recipeData) {
            fetchUser()
        }
    }, [recipeData])



    return (
        <div>
            <h1 className='header'>Recipe details</h1>
            <div className='recipe-details__back'>
                <button onClick={goBack}>{"<- Go back"}</button>
            </div>
            <div>
                {isUserRecipeOwner &&
                    <div>
                        <button onClick={() => setIsEditModalOpen(true)}>Edit</button>
                        <button onClick={handleDeleteRecipe}>Delete</button>
                    </div>}
            </div>
            <div className='recipe-details__content'>
                <h3 className='recipe-details-title'>{recipeData?.title}</h3>
                <p>{recipeData?.dateCreated}</p>
                <div className='recipe-details__author'>
                    <p>Recipe by: {userData?.name}</p>
                    <ChefIcon className='chef-icon' />
                </div>

                <div className='recipe-details__instructions'>
                    {recipeData?.instructions.map((instruction, index) => {
                        const number = index + 1
                        return <div className='instruction-line'>
                            <span className='instruction-number'>{number}</span> <p>{instruction}</p>
                        </div>
                    })}
                </div>
                <div className='recipe-details__tags'>
                    <span>Tags:</span>
                    {recipeData?.tags.map((tag) => {
                        return <span className='fixed-tag'>{tag}</span>
                    })}
                </div>
            </div>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                {isSavingRecipe ? <p>Saving...</p> : <AddRecipeForm onSubmit={handleSaveRecipe} editMode={true} editingData={recipeData} />}
            </Modal>
        </div>
    )
}

export default RecipeDetails