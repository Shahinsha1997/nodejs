import { getCurrentDate } from "../databaseActions/movDetailAction.mjs"
const ALL = 'all_movies'
const TODAY = 'today';
const THIS_WEEK = 'thisWeek'
const NEXT_WEEK = 'nextWeek'
const OTHER_RELEASE = 'otherRelease'
const RELEASED_MOVIES = 'releasedMovies'
//Movie Queries
const MOVIE_TABLE = 'movie_details'
export const getIdByMovId = (movie_id)=> `SELECT ID from ${MOVIE_TABLE} WHERE movie_id='${movie_id}' `
export const getMovieListQuery = 
    ({sortField, sortOrder, from, to, searchStr}) => 
        `SELECT  * from ${MOVIE_TABLE}
        ${[TODAY, THIS_WEEK, NEXT_WEEK, OTHER_RELEASE, RELEASED_MOVIES].includes(searchStr) ? `WHERE release_date ${getByDatas(searchStr)}` : 
        searchStr ? `WHERE (movie_id LIKE '%${searchStr}%' OR actor_name LIKE '%${searchStr}%')` : ''}
        ORDER BY ${sortField} ${sortOrder} LIMIT 20 OFFSET ${from};`
export const getMovieQuery = ({id}) => `SELECT  * from ${MOVIE_TABLE} WHERE ID = '${id}'`
export const getMovieByMovIdQuery = (id) => `SELECT  * from ${MOVIE_TABLE} WHERE movie_id = '${id}'`
export const insertMovieQuery = ({movie_id, actor_name, added_date, image_link, download_link, subtitle_link, rating, release_date}) => `INSERT INTO ${MOVIE_TABLE} (movie_id, actor_name, added_date, image_link, download_link, subtitle_link, rating, release_date)
VALUES ('${movie_id}', '${actor_name}', '${added_date}', '${image_link}', '${download_link}', '${subtitle_link}', '${rating}', '${release_date}')`
export const updateMovieQuery = ({id, values}) => `UPDATE ${MOVIE_TABLE} SET ${values} WHERE ID = '${id}'`
export const deleteMovieQuery = (id) => `DELETE FROM ${MOVIE_TABLE} WHERE ID='${id}';`;
//Count Queries

// export const getTodayMovieQuery = ()=> `SELECT * FROM ${MOVIE_TABLE} WHERE release_date = '${getCurrentDate()}';`;
// export const getThisWeekMovieQuery = ()=> `SELECT * FROM ${MOVIE_TABLE} WHERE release_date ${getByDatas('thisWeek')}`
// export const getNextWeekMovieQuery = ()=> `SELECT * FROM ${MOVIE_TABLE} WHERE release_date ${getByDatas('nextWeek')}`
// export const getOtherMovieQuery = ()=> `SELECT * FROM ${MOVIE_TABLE} WHERE release_date ${getByDatas('otherReleases')}`

const getByDatas = (type)=>{
    const dayInMs = 86400000
    let today = new Date()
    let startTime = today.setHours(0,0,0,0);
    let endTime = startTime + dayInMs
    if(type == THIS_WEEK){
        const day = today.getDay();
        startTime = startTime - (day * dayInMs)
        endTime = startTime + (7 * dayInMs)
    }else if(type == NEXT_WEEK || type == OTHER_RELEASE){
        const day = 7 - today.getDay();
        startTime = startTime + (day * dayInMs)
        endTime = startTime + (7 * dayInMs)
    }
    if(type == OTHER_RELEASE){
        return `> '${getCurrentDate(endTime)}'`;
    }else if(type == RELEASED_MOVIES){
        return ` <= '${getCurrentDate()}'`
    }else if(type == TODAY){
        return ` = '${getCurrentDate()}'`
    }
    return `BETWEEN '${getCurrentDate(startTime)}' AND '${getCurrentDate(endTime)}'`
}

const allMovieQuery = 'COUNT(ID) AS all_movies';
const todayMovieQuery = `COUNT(CASE WHEN release_date ${getByDatas(TODAY)} THEN 1 END) AS ${TODAY}`;
const thisWeekMovieQuery = `COUNT(CASE WHEN release_date ${getByDatas(THIS_WEEK)} THEN 1 END) AS ${THIS_WEEK}`;
const nextWeekMovieQuery = `COUNT(CASE WHEN release_date ${getByDatas(NEXT_WEEK)} THEN 1 END) AS ${NEXT_WEEK}`;
const otherMovieQuery = `COUNT(CASE WHEN release_date ${getByDatas(OTHER_RELEASE)} THEN 1 END) AS ${OTHER_RELEASE}`;

export const getMovieCountQuery = ()=>`SELECT ${allMovieQuery},${todayMovieQuery},${thisWeekMovieQuery},${nextWeekMovieQuery},${otherMovieQuery} FROM ${MOVIE_TABLE};`
