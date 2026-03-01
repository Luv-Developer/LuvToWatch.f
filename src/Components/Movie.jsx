import React from "react"
import { useEffect,useState } from "react"
import { supabase } from "../../SupabaseClient"
import axios from "axios"


const Movie = () => {

    const [email,setemail] = useState("")
    const [name,setname] = useState("")
    const [picture,setpicture] = useState("")

    useEffect(()=>{
        const checksession = async() => {
            const {data: {session}} = await supabase.auth.getSession()
            if(session?.user?.email){
                setemail(session.user.email)
            }
            if(session?.user?.user_metadata?.name){
                setname(session.user.user_metadata.name)
            }
            if(session?.user?.user_metadata?.picture){
                setpicture(session.user.user_metadata.picture)
            }
            else{
                window.location.href = "/"
            }
        }
        checksession()
    }, [name,email,picture])


    const Signout = async() => {
        await supabase.auth.signOut()
        window.location.href = "/"
    }

    // Movie-data

    const movie_data = [
        {
        id:1,
        priceincents:400,
        name:"Mission Impossible",
        quantity:1,
        image:"https://static1.srcdn.com/wordpress/wp-content/uploads/2024/11/image005.jpg"
        }
    ]


    // Connection with the Backend
    const getTicket = async() => {
        try{
        const response = await axios.post("http://localhost:5000/ticket",{data:movie_data,email:email},{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json"
            }
        })
        if(response.status == 200 || response.status == 201){
            let {url} = await response.data
            window.location.href = url
        }
      }
      catch(err){
        console.log(err)
      }
    }

    return(
        <>
        <h1>Welcome {name}</h1>
        <h4>Email is {email}</h4>
        <img src = {picture} />
        <br></br><br></br>
        <button onClick={Signout}>Sign Out</button>

        <h3>Mission Impossible 3</h3>
        <p>Tom Cruise Movie...</p>
        <button onClick={getTicket}>Book Ticket</button>
        </>
    )
}

export default Movie