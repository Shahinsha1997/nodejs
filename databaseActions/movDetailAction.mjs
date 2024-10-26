import { getRating } from "../utils/commonUtil.mjs";
import { getJMovDB } from "../utils/dbUtils.mjs";
import { deleteMovieQuery, getMovieByMovIdQuery, getMovieCountQuery, getMovieListQuery, getMovieQuery, insertMovieQuery, updateMovieQuery } from "../utils/movTableDetails.mjs";



const movDBQueries = async (query)=>{
    const movManagementDB =  await getJMovDB();
    const result = await movManagementDB.execute(query);
    movManagementDB.close();
    return result;
}
const movDBBatchQueries = async (queries) =>{
    const movManagementDB =  await getJMovDB();
    console.log(queries)
    const result = await movManagementDB.batch(queries,'write');
    movManagementDB.close();
    return result;
}

export const isMovExist = async (id) =>{
    const result = await movDBQueries(getMovieByMovIdQuery(id));
    return result.rows;
}
export const createMovie = async ({movie_id, actor_name, added_date=getCurrentDate(), image_link, download_link, subtitle_link, rating, release_date})=>{
    const result = await movDBQueries(insertMovieQuery({movie_id, actor_name, added_date, image_link, download_link, subtitle_link, rating: getRating(rating), release_date}));
    return result.lastInsertRowid;
}
export const updateMovie = async ({id, values})=>{
    const result = await movDBQueries(updateMovieQuery({id, values}));
    return result.lastInsertRowid;
}
export const getMovieList = async ({sortField, sortOrder, from, to, searchStr}) =>{
    const result = await movDBQueries(getMovieListQuery({sortField, sortOrder, from, to, searchStr}));
    return result.rows;
}
export const getMovie = async (id) =>{
    const result = await movDBQueries(getMovieByMovIdQuery(id));
    return result.rows;
}
export const deleteMovie = async (id)=>{
    const result = await movDBQueries(deleteMovieQuery(id));
    return result.rows;
}
export const movieCounts = async ()=>{
    const result = await movDBQueries(getMovieCountQuery())
    return result;
}

export function getCurrentDate(date='', isNormalFormat) {
    date = date ? new Date(date) : new Date();

    // Get year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-based, so we add 1
    const day = String(date.getDate()).padStart(2, '0');         // Pad day with leading zero

    return isNormalFormat ? `${day}-${month}-${year}` : `${year}-${month}-${day}`;
}