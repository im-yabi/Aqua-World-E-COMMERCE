import { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, getReviews } from "../../actions/productActions";
import { clearError, clearReviewDeleted } from "../../slices/productSlice";
import Loader from "../layouts/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import MetaData from "../layouts/MetaData";

export default function ReviewList() {
    const { reviews = [], loading = false, error, isReviewDeleted } = useSelector(state => state.productState);
    const [productId, setProductId] = useState("");
    const dispatch = useDispatch();

    const deleteHandler = (e, reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            e.target.disabled = true;
            dispatch(deleteReview(productId, reviewId));
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (!productId.trim()) {
            toast("Please enter a valid Product ID", {
                type: "warning",
                position: toast.POSITION.BOTTOM_CENTER,
            });
            return;
        }
        dispatch(getReviews(productId));
    };

    const setReviews = () => {
        return {
            columns: [
                { label: "ID", field: "id", sort: "asc" },
                { label: "Rating", field: "rating", sort: "asc" },
                { label: "User", field: "user", sort: "asc" },
                { label: "Comment", field: "comment", sort: "asc" },
                { label: "Actions", field: "actions", sort: "asc" }
            ],
            rows: reviews.map(review => ({
                id: review._id,
                rating: review.rating,
                user: review.user?.name || "Unknown",
                comment: review.comment,
                actions: (
                    <Fragment key={review._id}>
                        <Button
                            onClick={e => deleteHandler(e, review._id)}
                            className="btn btn-danger py-1 px-2 ml-2"
                        >
                            <i className="fa fa-trash"></i>
                        </Button>
                    </Fragment>
                )
            }))
        };
    };

    useEffect(() => {
        if (error) {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: "error",
                onOpen: () => dispatch(clearError())
            });
        }

        if (isReviewDeleted) {
            toast("Review Deleted Successfully!", {
                type: "success",
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearReviewDeleted())
            });
            dispatch(getReviews(productId));
        }
    }, [dispatch, error, isReviewDeleted, productId]);

    return (
        <div className="row">
            <MetaData title={"Review List"} />
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>

            <div className="col-12 col-md-10">
                <h1 className="my-4">Review List</h1>

                <div className="row justify-content-center mt-5">
                    <div className="col-5">
                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                <label>Product ID</label>
                                <input
                                    type="text"
                                    onChange={e => setProductId(e.target.value)}
                                    value={productId}
                                    className="form-control"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary btn-block py-2">
                                Search
                            </button>
                        </form>
                    </div>
                </div>

                <Fragment>
                    {loading ? (
                        <Loader />
                    ) : reviews.length === 0 && productId ? (
                        <p className="mt-4 text-center">No reviews found for this product.</p>
                    ) : (
                        <MDBDataTable
                            data={setReviews()}
                            bordered
                            striped
                            hover
                            className="px-3 table-body"
                        />
                    )}
                </Fragment>
            </div>
        </div>
    );
}
