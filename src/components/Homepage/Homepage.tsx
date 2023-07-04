import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import Modal from '../Modal/Modal';

import "./Homepage.css"

type RecipeType = {
    authorId: string,
    dateCreated: string,
    id: string
    instructions: string[]
    tags: string[]
    title: string
}

type RecipeToAddType = {
    authorId: string,
    dateCreated: string,
    instructions: string[]
    tags: string[]
    title: string
}

type RecipeRequestFormatType = {
    recipe: {
        authorId: string,
        dateCreated: string,
        instructions: string[]
        tags: string[]
        title: string
    }
}

const Homepage = () => {

    const navigate = useNavigate()
    const [allRecipes, setAllRecipes] = useState<RecipeType[]>([])
    const [recipes, setRecipes] = useState<RecipeType[]>([])
    const [searchValue, setSearchValue] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [tag, setTag] = useState('')
    const [tags, setTags] = useState<string[]>([])

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
            setAllRecipes(data.recipes)
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

    const handleSearch = () => {
        const filteredRecipes = allRecipes.filter((recipe) => {
            return recipe.title.toLowerCase().includes(searchValue.toLowerCase())
        })

        setRecipes(filteredRecipes)
    }

    const onModalClose = () => {
        setIsModalOpen(false)
    }

    console.log({ searchValue })


    const addRecipe = async (recipe: RecipeRequestFormatType) => {
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
                setTag('')
                setTags([])
            }

        } catch (error) {
            console.log(error)
        }
    }
    const storedUser = JSON.parse(localStorage.getItem('appUser')!);

    const authorId = storedUser.id
    const dateCreated = new Date(Date.now())
    const dateDay = dateCreated.getDate()
    const month = dateCreated.getMonth()
    const year = dateCreated.getFullYear()
    const dateFormatted = `${year}-${month}-${dateDay}`



    const onCreateRecipe = (e: React.FormEvent) => {
        e.preventDefault()



        const target = e.target as typeof e.target & {
            title: { value: string }
            instructions: { value: string }
            tags: { value: string }
        }



        const recipe: RecipeToAddType = {
            authorId: authorId,
            dateCreated: dateFormatted,
            instructions: [target.instructions.value],
            tags: tags,
            title: target.title.value
        }

        console.log(recipe)

        const formattedRecipe = {
            recipe: recipe
        }

        addRecipe(formattedRecipe)
    }

    const handleAddTagg = () => {
        setTags([...tags, tag])
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
                <h2>Create a new recipe!</h2>
                <div>
                    <form className="new-recipe-form" onSubmit={onCreateRecipe}>
                        <input type="text" name='title' placeholder='Title' />
                        <textarea name='instructions' placeholder='Instructions' />

                        <div>
                            <p>Add a tag</p>
                            <input type="text" name="tag" placeholder='Tag' onChange={(e) => setTag(e.target.value)} />
                            <button type='button' onClick={handleAddTagg}>Add</button>
                        </div>
                        <div>
                            <div>Tags</div>
                            <div>
                                {tags.map((tag) => (
                                    <div>
                                        <span key={tag}>{tag}</span>
                                        <span onClick={() => setTags(tags.filter((t) => t !== tag))}>X</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button type='submit'>Create</button>
                    </form>
                </div>
            </Modal>

        </div>

    )
}

export default Homepage