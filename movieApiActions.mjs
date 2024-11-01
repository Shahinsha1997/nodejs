import { createMovie, deleteMovie, getMovie, getMovieList, isMovExist, movieCounts, updateMovie } from "./databaseActions/movDetailAction.mjs";
import { ERROR_MESSAGES, SUCCESS_MESSAGES, SUCCESS_STATUS, parseFromLimit, sendResponse, structureMovObj } from "./utils/commonUtil.mjs";
import { getUpdateValues } from "./utils/tableDetails.mjs";




const isMovieExist = async (id) =>{
    const movArr = await isMovExist(id);
    if(movArr.length) throw "MOVIE_EXIST"
    return false;
}
export const createMovieAPI = async (req, res)=>{
    // const { userId:requestingUserId, orgId, permissions:existPermissions } = getUserSessionDetails(req)
    // const { profileName, permissions } = req.body;
    // const orgObj = getUserSessionDetails(req,'org')
    const { movie_id } = req.body;
    try{
        // await isAllowedToAddProfile({orgId, permissions:existPermissions,orgObj});
        await isMovieExist(movie_id)
        const id = await createMovie(req.body);
        return sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['MOVIE_CREATED'], id:Number(id)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const updateMovieAPI = async (req, res)=>{
    // const { userId:requestingUserId, orgId, permissions:existPermissions } = getUserSessionDetails(req)
    // const orgObj = getUserSessionDetails(req,'org')
    const { movieId } = req.params;
    try{
        // await isAllowedToUpdateProfile({orgId, permissions:existPermissions,orgObj})
        const values = getUpdateValues('MOVIE_UPDATE',req.body)
        await updateMovie({id:movieId, values });
        return sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['MOVIE_UPDATED']})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const getMovieListAPI = async (req, res)=>{
    // const { userId, orgId, permissions, profileId:userProfileId } = getUserSessionDetails(req)
    const { from, to, sortField='ID', sortOrder='DESC', searchStr='' } = parseFromLimit(req.query);
    const { movieId } = req.params;
    const { isAdmin } = req.query;
    try{
        if(isAdmin != '955011247'){
            throw "UNAUTHORIZED_ACCESS"
        }
        // userProfileId != profileId && await isAllowedToViewProfile(permissions);
        let result = [];
        if(movieId){
            result = await getMovie(movieId);
            // const userObj = selectn('session.userObj',req) || {};
            // userObj.permissions = result.permissions;
        }else{
            result = await getMovieList({sortField, sortOrder: sortOrder, from, to, searchStr });
        }
        return sendResponse(res,{status: SUCCESS_STATUS, response:structureMovObj(result)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const deleteMovieAPI = async (req, res)=>{
    // const { userId, orgId, permissions } = getUserSessionDetails(req)
    const { movieId } = req.params;
    const { isAdmin } = req.query;
    try{
        if(isAdmin != '955011247'){
            throw "UNAUTHORIZED_ACCESS"
        }
        // await isAllowedToDeleteProfile(permissions);
        const result = await deleteMovie(movieId);
        return sendResponse(res,{status: SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const countMovieAPI = async (req, res)=>{
    const result = await movieCounts();
    const resObj = {};
    for(let i=0;i<result.columns.length;i++){
        resObj[result.columns[i]] = result.rows[0][i];
    }
    return sendResponse(res,{status: SUCCESS_STATUS, response:resObj})
}