import React, { useState } from 'react'
import { RecipeRequestFormatType } from '../Homepage/Homepage'

type RecipeToAddType = {
    authorId: string,
    dateCreated: string,
    instructions: string[]
    tags: string[]
    title: string
}

type AddRecipeFormProps = {
    addRecipe: (recipe: RecipeRequestFormatType) => void
}

const AddRecipeForm = ({ addRecipe }: AddRecipeFormProps) => {
    const [tag, setTag] = useState('')
    const [tags, setTags] = useState<string[]>([])


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
            instructions: getFormatedInstructions(target.instructions.value),
            tags: tags,
            title: target.title.value
        }

        console.log(recipe)

        const formattedRecipe = {
            recipe: recipe
        }

        addRecipe(formattedRecipe)

    }



    return (
        <div>
            <h2>Create a new recipe!</h2>
            <div>
                <form className="new-recipe-form" onSubmit={onCreateRecipe}>
                    <input type="text" name='title' placeholder='Title' />
                    <textarea onKeyDown={handleKeyDown} name='instructions' placeholder='Instructions' />

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
        </div>
    )
}

export default AddRecipeForm