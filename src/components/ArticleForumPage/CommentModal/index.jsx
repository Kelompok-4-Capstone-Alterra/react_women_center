import React, { useEffect, useState } from 'react';
import CommentCard from '../CommentCard';
import CommentIcon from '@mui/icons-material/Comment';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '../../Modal';
import axios from 'axios';
import { deleteCommentByArticleIdCommentId, getAllCommentByArticleId } from '../../../api/comment';
import { updateComments } from '../../../features/article/commentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, MenuItem, Select, Skeleton, Snackbar } from '@mui/material';

const CommentModal = ({ openModal, onClose, articleId }) => {
  const comments = useSelector((store) => store.commentReducer.comments);
  const dispatch = useDispatch();

  const [isShowToast, setIsShowToast] = useState({
    isOpen: false,
    variant: 'info',
    duration: 5000,
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notFoundMsg, setNotFoundMsg] = useState('');

  useEffect(() => {
    fetchAllComment();
  }, [articleId]);

  const fetchAllComment = async () => {
    setIsLoading(true);

    if (articleId) {
      try {
        const response = await getAllCommentByArticleId(articleId);
        dispatch(updateComments(response));
        setIsLoading(false);
        console.log(response);
        console.log(comments);

        if (response.length < 1) {
          setNotFoundMsg("What you are looking for doesn't exist");
        }
      } catch (error) {
        setIsShowToast({
          ...isShowToast,
          isOpen: true,
          variant: 'error',
          message: error.message,
        });
        setIsLoading(false);
      }
    }

    setNotFoundMsg("What you are looking for doesn't exist");
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await deleteCommentByArticleIdCommentId(articleId, commentId);
      setIsShowToast({
        ...isShowToast,
        isOpen: true,
        variant: 'success',
        message: response.message,
      });
      fetchAllComment();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Snackbar open={isShowToast.isOpen} autoHideDuration={isShowToast.duration} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => setIsShowToast({ ...isShowToast, isOpen: false })}>
        <Alert onClose={() => setIsShowToast({ ...isShowToast, isOpen: false })} severity={isShowToast.variant} sx={{ width: '100%' }} className="capitalize">
          {isShowToast.message}
        </Alert>
      </Snackbar>
      <Modal isOpen={openModal} onClose={onClose}>
        <div className="p-[32px] flex flex-col w-full">
          <div className="py-2">
            <div className="flex justify-between w-full mb-[44px]">
              <div>
                <CommentIcon /> 123 Commnets
              </div>
              <button onClick={() => onClose(false)}>
                <CloseIcon className="bg-black text-white w-[18px] h-[18px]" />
              </button>
            </div>

            <div>
              {comments.length >= 1 ? (
                comments.map((comment) =>
                  isLoading ? (
                    <Skeleton key={comment.id} animation="wave" variant="rounded" width="100%" height={150} />
                  ) : (
                    <CommentCard
                      key={comment.id}
                      payloads={comment}
                      // openModal={handleShowModal}
                      deleteComment={deleteComment}
                    />
                  )
                )
              ) : (
                <h3 className="flex justify-center items-center font-semibold">{notFoundMsg}</h3>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CommentModal;