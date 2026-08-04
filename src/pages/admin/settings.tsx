import React, { useEffect, useState } from "react";
import { useActiveOrg } from "../../hooks/useActiveOrg";
import { generateSlug } from "../../utils/orgHelpers";
import { supabase } from "../../lib/supabase";


interface EditOrgPaYload {
    name: string;
    address: string;
    slug: string;
}

export default function SettingsPage() {
    const {activeOrg} = useActiveOrg(); 
    const [name , setName] = useState('') ; 
    const [address , setAdress] = useState('') ;
    const [loading , setLoading] = useState(false)

    const churchCode = activeOrg?.church_code ;
    const orgId = activeOrg?.id

    const editOrg = async (e : React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault() ;
        setLoading(true)
        const newSlug = generateSlug(name)
        try {
            const payload : EditOrgPaYload = {name , address , slug : newSlug }

            const { error} = await supabase
            .from('organizations')
            .update(payload)
            .eq('id' , orgId)
            .single()
        } catch(error) {
            throw error
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log(activeOrg)
    } , [])

    return (
        <div>
            <h1>this is just a placeHolder</h1>
            <p>{churchCode}</p>
            <form onSubmit={editOrg}>
                <input type="text " value={name}  onChange={(e) => setName(e.target.value)}/>
                <input type="text " value={address}  onChange={(e) => setAdress(e.target.value)}/>
                    <button type="submit" >
                        save
                </button>
            </form>
        </div>
    )
}