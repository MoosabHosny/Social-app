import axios from "axios";
import { useParams } from "react-router"; 
import { useEffect, useState } from "react";
import PostCard from "../../Components/PostCard/PostCard";
import Loading from "../Loading/Loading";

export default function PostDetails() {
    const { id } = useParams();
    const [ post, setPost ] = useState(null);

    async function getSinglePost() {
        try {
            const response = await axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
                headers: {
                    token: localStorage.getItem('token')
                }
            });
            setPost(response.data.data.post);
            
        } catch (error) {
            // console.error("Error fetching post:", error.response?.data);
        }
    }

    useEffect(() => {
            getSinglePost();
    }, []);

    return <>
        <div className="max-w-3xl mx-auto">
            {post ? <PostCard userPost={post} /> : <Loading />}
        </div>
    </>
}
