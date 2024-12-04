// import QueryBuilder from "./databaseActions/commonDatabaseFile.mjs";
import QueryBuilder from "./databaseActions/commonDatabaseFile.mjs";
import { ERROR_MESSAGES, MOVIE_DB, MOV_ACC, SUCCESS_MESSAGES, SUCCESS_STATUS, getRating, parseFromLimit, sendResponse, structureMovObj, structureUsageObj } from "./utils/commonUtil.mjs";
import { getByDatas, getCurrentDate, getMovieCountFields } from "./utils/movTableDetails.mjs";
import { getUpdateValues } from "./utils/tableDetails.mjs";

const MOVIE_TABLE = 'movie_details'
const TODAY = 'today';
const THIS_WEEK = 'thisWeek'
const NEXT_WEEK = 'nextWeek'
const OTHER_RELEASE = 'otherRelease'
const RELEASED_MOVIES = 'releasedMovies'

const getCondition = (searchStr)=>{
    return [TODAY, THIS_WEEK, NEXT_WEEK, OTHER_RELEASE, RELEASED_MOVIES].includes(searchStr) ? `release_date ${getByDatas(searchStr)}` : 
    searchStr ? `(movie_id LIKE '%${searchStr}%' OR actor_name LIKE '%${searchStr}%')` : ''
}

const isMovieExist = async (id) =>{
    const queryBuilder = new QueryBuilder(MOVIE_DB);
    const movArr = await queryBuilder.select({
        fields: ["*"],
        tableName: MOVIE_TABLE,
        // joins: [{ type: "LEFT", table: "orders", on: "users.id = orders.user_id" }],
        condition: `movie_id = '${id}'`,
        // groupBy: ["users.id", "users.name"],
        // having: "orderCount > 2",
        // orderBy: "users.name ASC",
        limit: 10,
        offset: 0,
      });
    await queryBuilder.closeDB();
    if(movArr.length) throw "MOVIE_EXIST"
    return false;
}
export const getMovUsageStatsAPI = async (req, res)=>{
    try{
        const queryBuilder = new QueryBuilder(MOV_ACC);
        const result = await queryBuilder.usage('javmov');
        return sendResponse(res,{status: SUCCESS_STATUS, response:structureUsageObj(result)});
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const createMovieAPI = async (req, res)=>{
    // const { userId:requestingUserId, orgId, permissions:existPermissions } = getUserSessionDetails(req)
    // const { profileName, permissions } = req.body;
    // const orgObj = getUserSessionDetails(req,'org')
    const { movie_id } = req.body;
    try{

        // await isAllowedToAddProfile({orgId, permissions:existPermissions,orgObj});
        await isMovieExist(movie_id)
        const queryBuilder = new QueryBuilder(MOVIE_DB);
        const {movie_id:movId, actor_name, added_date=getCurrentDate(), image_link, download_link, subtitle_link, rating, release_date} = req.body;
        const id = await queryBuilder.create({
            tableName: MOVIE_TABLE,
            data: {movie_id:movId, actor_name, added_date, image_link, download_link, subtitle_link, rating: getRating(rating), release_date}
        })
        await queryBuilder.closeDB();
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
        const queryBuilder = new QueryBuilder(MOVIE_DB);
        const values = getUpdateValues('MOVIE_UPDATE',req.body)
        console.log(values);
        const id = await queryBuilder.update({
            tableName: MOVIE_TABLE,
            condition: `movie_id = '${movieId}'`,
            values
        })
        await queryBuilder.closeDB();
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
        const queryBuilder = new QueryBuilder(MOVIE_DB);
        if(movieId){
            // result = await getMovie(movieId);
            result =  await queryBuilder.select({
                fields: ["*"],
                tableName: MOVIE_TABLE,
                condition: `movie_id = '${movieId}'`
            });
            // const userObj = selectn('session.userObj',req) || {};
            // userObj.permissions = result.permissions;
        }else{
            result = await queryBuilder.select({
                fields: ["*"],
                tableName: MOVIE_TABLE,
                condition: getCondition(searchStr),
                orderBy: `${sortField} ${sortOrder}`,
                limit: 20,
                offset: from,
              });
        }
        await queryBuilder.closeDB();
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
        const queryBuilder = new QueryBuilder(MOVIE_DB);
        const values = getUpdateValues('MOVIE_UPDATE',req.body)
        const id = await queryBuilder.delete({
            tableName: MOVIE_TABLE,
            condition: `movie_id = '${movieId}'`,
            data: values
        })
        await queryBuilder.closeDB();
        return sendResponse(res,{status: SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const countMovieAPI = async (req, res)=>{
    const queryBuilder = new QueryBuilder(MOVIE_DB);
    const result = await queryBuilder.select({
        fields: getMovieCountFields(),
        tableName: MOVIE_TABLE
      });
    await queryBuilder.closeDB();
    return sendResponse(res,{status: SUCCESS_STATUS, response:result[0] || {}})
}