import React, { useEffect, useState } from 'react'
import { RecipeRequestFormatType } from '../Homepage/Homepage'
import { RecipeDetailsType } from '../RecipeDetails/RecipeDetails'

import "./AddRecipeForm.css"

export type RecipeToAddType = {
    authorId: string,
    dateCreated: string,
    instructions: string[]
    tags: string[]
    title: string
}

type AddRecipeFormProps = {
    onSubmit: (recipe: RecipeToAddType) => void
    editMode?: boolean
    editingData?: RecipeDetailsType
}

const AddRecipeForm = ({ onSubmit, editMode = false, editingData }: AddRecipeFormProps) => {
    const [tag, setTag] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [title, setTitle] = useState('')
    const [instructions, setInstructions] = useState('')

    useEffect(() => {
        if (editMode && editingData) {
            const formattedInstructions = editingData.instructions.join('\n');
            setTitle(editingData.title)
            setInstructions(formattedInstructions)
            setTags(editingData.tags)
        }
    }, [])


    const handleAddTagg = () => {
        setTags([...tags, tag])
    }

    const getFormatedInstructions = (instructions: string) => {
        //replace multiple newlines with a single newline
        const purifyedInstructions = instructions.replace(/\n+/g, '\n');
        //break string into an array based on newlines
        const formattedInstructions = purifyedInstructions.split('\n')
        return formattedInstructions
    }

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            const hasNewLine = event.target.value.includes('\n');
            setInstructions(event.target.value)
            console.log('New line entered:', hasNewLine);
        }
    };

    const onCreateRecipe = (e: React.FormEvent) => {
        e.preventDefault()

        const storedUser = JSON.parse(localStorage.getItem('appUser')!);
        const authorId = storedUser.id
        const dateCreated = new Date(Date.now())
        const dateDay = dateCreated.getDate()
        const month = dateCreated.getMonth()
        const year = dateCreated.getFullYear()
        const dateFormatted = `${year}-${month}-${dateDay}`


        const target = e.target as typeof e.target & {
            title: { value: string }
            instructions: { value: string }
            tags: { value: string }
        }





        const recipe: RecipeToAddType = {
            authorId: authorId,
            dateCreated: dateFormatted,
            instructions: getFormatedInstructions(instructions),
            tags: tags,
            title: title
        }

        console.log(recipe)



        onSubmit(recipe)

    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInstructions(e.target.value)
        console.log(instructions)
    }



    return (
        <div>
            <h2>Create a new recipe!</h2>
            <div>
                <form className="new-recipe-form" onSubmit={onCreateRecipe}>
                    <div className='new-recipe-form__head'>

                        <label htmlFor="add-recipe-title-id">Title of your recipe:</label>
                        <input id="add-recipe-title-id" type="text" name='title' placeholder='Title' value={title} onChange={handleTitleChange} />
                        <textarea className='new-recipe-form__instructions' id='add-recipe-instructions-id' onKeyDown={handleKeyDown} name='instructions' placeholder='Instructions' value={instructions} onChange={handleInstructionsChange} />
                    </div>

                    <div>
                        <p>Add a tag</p>
                        <input type="text" name="tag" placeholder='Tag' onChange={(e) => setTag(e.target.value)} />
                        <button type='button' onClick={handleAddTagg}>Add</button>
                    </div>
                    <div>
                        <div>Tags</div>
                        <div className='form-tag-collection'>
                            {tags.map((tag) => (
                                <div className='fixed-tag edit-tag'>
                                    <span key={tag}>{tag}</span>
                                    <span onClick={() => setTags(tags.filter((t) => t !== tag))}>| x</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type='submit'>{editMode ? 'Save Recipe' : 'Add Recipe'}</button>
                </form>
            </div>
        </div>
    )
}

export default AddRecipeForm