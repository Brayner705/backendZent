import express from "express"
import { Goals } from "../models/goal.js"


const router = express.Router()

// Save a goal
router.post("/:user_id", async(req, res) => {
    const {user_id} = req.params
    const {nameGoal,totalGoal} = req.body

    console.log("entre")

    try{
        const newGoal = new Goals({
            user_id: user_id,
            nameGoal: nameGoal,
            totalGoal: totalGoal
        });

        await newGoal.save()

        const goals = await Goals.find({user_id})
    
        return res.status(200).json({
            "message": "Se ha registrado con exito la meta",
            goals
        })

    }catch(error){
        console.error("Ha ocurrido un error en el servidor: ", error)
        
        return res.status(500).json({
            "message": "Ha ocurrido un error en el servidor",
            error
        })

    }

})

// Get all goals
router.get("/:user_id", async(req,res)=> {
    const {user_id} = req.params

    try{

        const goals = await Goals.find({user_id})

        return res.status(200).json({
            "message": "Se obtuvieron las metas con exito",
            goals
        })

    }catch(error){
        console.error("Ha ocurrido un error: ", error)

        return res.status(500).json({
            "message": "Ha ocurrido un error",
            error
        })
    }
})

// update a goal
router.put("/:user_id", async (req, res)=> {
    const {user_id} = req.params
    const {nameGoal, totalToSaved} = req.body

    try {

        const goal = await Goals.updateOne({
            user_id: user_id,nameGoal: nameGoal}, 
            {
                $inc: {
                    totalSaved: totalToSaved
                }
            })
        
        const goalUpdate = await Goals.findOne({user_id, nameGoal})

        goalUpdate.percentage = Math.floor((goalUpdate.totalSaved / goalUpdate.totalGoal) * 100)

        await goalUpdate.save()

        const goals = await Goals.find({user_id}).select('nameGoal totalGoal totalSaved percentage -_id')


        return res.status(200).json({
            "message": "Se ha actualizado la meta con exito",
            goals
        })

    }catch (error){
        console.error("Ha ocurrido un error: ", error)
        return res.status(500).json({
            "message": "Ha ocurrido un error en el servidor",
            error
        })
    }

})

export default router;