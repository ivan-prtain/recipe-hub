import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import Modal from '../Modal/Modal';
import AddRecipe from '../AddRecipe/AddRecipeForm';
import { RecipeToAddType } from '../AddRecipe/AddRecipeForm';
import foodImage from '../../assets/images/food-default.jpg';

import "./Homepage.css"

type RecipeType = {
    authorId: string,
    dateCreated: string,
    id: string
    instructions: string[]
    tags: string[]
    title: string
}

enum SearchOption {
    title = "title",
    tags = "tags"
}

const Homepage = () => {

    const navigate = useNavigate()
    const [allRecipes, setAllRecipes] = useState<RecipeType[]>([])
    const [recipes, setRecipes] = useState<RecipeType[]>([])
    const [searchValue, setSearchValue] = useState('')
    const [searchOption, setSearchOption] = useState<SearchOption>(SearchOption.title)
    const [isSubmittingRecipe, setIsSubmittingRecipe] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [onlyAuthorsRecipes, setOnlyAuthorsRecipes] = useState(false)

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
            setAllRecipes(data.recipes)
            setRecipes(data.recipes.slice(0, 10))
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
        if (searchValue === "") {
            console.log("true")
            setRecipes(allRecipes.slice(0, 10))
            setCurrentPage(1)

        }
        else if (searchOption === SearchOption.title) {
            const filteredRecipes = allRecipes.filter((recipe) => {
                return recipe.title.toLowerCase().includes(searchValue.toLowerCase())
            })
            setRecipes(filteredRecipes)
        } else {
            const filteredRecipes = allRecipes.filter((recipe) => {
                return recipe.tags.some((tag) => {
                    return tag.toLowerCase().includes(searchValue.toLowerCase())
                })
            })
            setRecipes(filteredRecipes)
        }
    }

    const onModalClose = () => {
        setIsModalOpen(false)
    }

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

    const addPage = () => {
        const startIndex = currentPage * 10
        const endIndex = startIndex + 10
        const contentToAdd = allRecipes.slice(startIndex, endIndex)
        setRecipes([...recipes, ...contentToAdd])
        setCurrentPage(currentPage + 1)
    }

    const handleSelectChagnge = (event: any) => {
        setSearchOption(event.target.value)
    }

    const handleAuthorToggle = () => {
        if (!onlyAuthorsRecipes) {
            const authorRecipes = allRecipes.filter((recipe) => {
                const userData = JSON.parse(localStorage.getItem('appUser')!)
                return recipe.authorId === userData.id
            })
            setRecipes(authorRecipes)
        } else {
            setRecipes(allRecipes.slice(0, 10))
            setCurrentPage(1)
        }

        setOnlyAuthorsRecipes(!onlyAuthorsRecipes)
    }


    return (
        <div className='main-wrapper'>
            <div className='header'>
                <h1>Tasty Recipes</h1>
                <div>
                    <select className='select-search-option' onChange={handleSelectChagnge}>
                        <option value='title'>Title</option>
                        <option value='tags'>Tags</option>
                    </select>
                    <input onKeyDown={handleSearchKeyDown} placeholder='search' onChange={(e) => setSearchValue(e.target.value)} />
                    <button onClick={handleSearch}>Search</button>
                </div>
                <div>
                    <button className='add-recipe-button' onClick={() => setIsModalOpen(true)}>Add your Recipe!</button>
                </div>
            </div>
            <div>
                <button onClick={handleAuthorToggle}>
                    {onlyAuthorsRecipes ? "Show all recipes" : "Show only my recipes"}
                </button>
            </div>
            {recipes.length > 0 ?
                <div className='recipes-collection' >

                    {recipes.map((recipe) => (
                        <div key={recipe.id} className='recipe' onClick={() => handleRecipeClick(recipe.id)}>
                            <div className='recipe-thumbnail'>
                                <img src={foodImage} alt='food in bowl' />
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
            <div className='load-more-container'>

                {!onlyAuthorsRecipes && !searchValue && < button className='load-more' onClick={addPage}>Load more...</button>}
            </div>
        </div >
    )
}

export default Homepage