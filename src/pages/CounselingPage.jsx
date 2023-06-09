import React, { useEffect, useState } from "react";

import TableTitle from "../components/Dashboard/Tables/TableTitle";
import TableContainer from "../components/Dashboard/Tables/TableContainer";
import TableHeader from "../components/Dashboard/Tables/TableHeader";
import Tables from "../components/Dashboard/Tables/Tables";
import TableBody from "../components/Dashboard/Tables/TableBody";
import TableRow from "../components/Dashboard/Tables/TableRow";
import DropdownPage from "../components/DropdownPage";
import StatusTag from "../components/StatusTag/index";
import ButtonPrimary from "../components/ButtonPrimary";
import ButtonOutline from "../components/ButtonOutline/index";
import ScheduleModal from "../components/Dashboard/Counseling/ScheduleModal";
import UpdateModal from "../components/Dashboard/Counseling/UpdateModal/index";
import ViewModal from "../components/Dashboard/Counseling/ViewModal/index";
import DeleteModal from "../components/Dashboard/Counseling/DeleteModal/index";
import LinkModal from "../components/Dashboard/Counseling/LinkModal";
import CancelModal from "../components/Dashboard/Counseling/CancelModal";
import Popup from "../components/Dashboard/Popup";
import PaginationTable from "../components/PaginationTable";

import { getAllTransactions } from "../api/transaction";
import { getAllCounselors } from "../api/usercounselor";
import { formatCurrency } from "../helpers/formatCurrency";
import { convertDate } from "../helpers/convertDate";

import { useForm } from "react-hook-form";
import { Delete, Edit, Visibility, Add, Link } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { hideId } from "../helpers/hideId";
import { convertTime } from "../helpers/converTime";

const CounselingPage = () => {
  // Table State
  const [isSchedule, setIsSchedule] = useState(true);

  // Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Data State
  const [transactions, setTransactions] = useState([]);
  const [counselors, setCounselors] = useState([]);

  // Feature State
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [scheduleSortBy, setScheduleSortBy] = useState("newest");
  const [transactionSortBy, setTransactionSortBy] = useState("newest");
  const [scheduleSearchParams, setScheduleSearchParams] = useState("");
  const [transactionSearchParams, setTransactionSearchParams] = useState("");

  // Popup State
  const [isPopup, setIsPopup] = useState(false);
  const [popupSuccess, setPopupSuccess] = useState(true);
  const [popupMessage, setPopupMessage] = useState("success");

  // Pagination State
  const [currentSchedulePages, setCurrentSchedulePages] = useState("");
  const [totalSchedulePages, setTotalSchedulePages] = useState("");
  const [rowsPerSchedulePage, setRowsPerSchedulePage] = useState(10);
  const [currentTransactionPages, setCurrentTransactionPages] = useState("");
  const [totalTransactionPages, setTotalTransactionPages] = useState("");
  const [rowsPerTransactionPage, setRowsPerTransactionPage] = useState(10);

  // Helper State
  const [isLoading, setIsLoading] = useState(false);
  const [isShowToast, setIsShowToast] = useState({
    isOpen: false,
    variant: "info",
    duration: 5000,
    message: "",
  });
  const [notFoundMsg, setNotFoundMsg] = useState("");

  // React Hook Form
  const { getValues, control } = useForm();

  // Helper Functions
  const handleSelect = () => {
    const formData = getValues();
    const dropdownValue = formData.pageStatus;
    setIsSchedule(dropdownValue.value);
  };

  const handlePopup = (type, message) => {
    setIsPopup(true);
    setPopupSuccess(type);
    setPopupMessage(message);
    setTimeout(function () {
      setIsPopup(false);
    }, 2000);
  };

  const handleSubmitSchedule = (popupType, popupMessage) => {
    setScheduleSearchParams("");
    fetchAllCounselors({
      has_schedule: true,
      sort_by: scheduleSortBy,
      search: scheduleSearchParams,
    });
    handlePopup(popupType, popupMessage);
  };

  const handleSumbitTransaction = (popupType, popupMessage) => {
    setTransactionSearchParams("");
    fetchAllTransactions({
      sort_by: scheduleSortBy,
      search: scheduleSearchParams,
    });
    handlePopup(popupType, popupMessage);
  };

  const handleScheduleSearch = (e) => {
    setScheduleSearchParams(e.target.value);
    setCurrentSchedulePages(1);
  };
  const handleTransactionSearch = (e) => {
    setTransactionSearchParams(e.target.value);
    setCurrentTransactionPages(1);
  };
  const handleScheduleSortBy = (e) => {
    setScheduleSortBy(e.target.value);
    setCurrentSchedulePages(1);
  };
  const handleTransactionSortBy = (e) => {
    setTransactionSortBy(e.target.value);
    setCurrentTransactionPages(1);
  };

  // Fetch Functions
  const fetchAllCounselors = async (params = {}) => {
    setIsLoading(true);
    try {
      const { counselors, current_pages, total_pages } = await getAllCounselors(
        params
      );
      setCounselors(counselors);
      setCurrentSchedulePages(current_pages);
      setTotalSchedulePages(total_pages);
      setIsLoading(false);
      if (counselors.length < 1) {
        setNotFoundMsg("What you are looking for doesn't exist");
      }
    } catch (error) {
      setIsLoading(false);
    }
    setNotFoundMsg("What you are looking for doesn't exist");
  };

  const fetchAllTransactions = async (params = {}) => {
    setIsLoading(true);
    try {
      const { transaction, current_pages, total_pages } =
        await getAllTransactions(params);
      setTransactions(transaction);
      setCurrentTransactionPages(current_pages);
      setTotalTransactionPages(total_pages);
      setIsLoading(false);
      if (response.length < 1) {
        setNotFoundMsg("What you are looking for doesn't exist");
      }
    } catch (error) {
      setIsLoading(false);
    }
    setNotFoundMsg("What you are looking for doesn't exist");
  };

  // Use Effect
  useEffect(() => {
    fetchAllCounselors({
      has_schedule: true,
      sort_by: scheduleSortBy,
      search: scheduleSearchParams,
      limit: rowsPerSchedulePage,
      page: currentSchedulePages,
    });
  }, [scheduleSortBy, scheduleSearchParams]);

  useEffect(() => {
    fetchAllTransactions({
      sort_by: transactionSortBy,
      search: transactionSearchParams,
      limit: rowsPerTransactionPage,
      page: currentTransactionPages,
    });
  }, [transactionSortBy, transactionSearchParams]);

  return (
    <div className="">
      {/* POPUP */}
      <Popup isSuccess={popupSuccess} isOpen={isPopup} message={popupMessage} />
      {/* SCHEDULE MODAL */}
      <ScheduleModal
        modalState={showScheduleModal}
        closeModal={() => {
          setShowScheduleModal(false);
        }}
        onSubmit={handleSubmitSchedule}
      />
      {/* VIEW MODAL */}
      <ViewModal
        counselor={selectedCounselor}
        modalState={showViewModal}
        closeModal={() => {
          setShowViewModal(false);
        }}
      />
      {/* Update Modal */}
      <UpdateModal
        counselor={selectedCounselor}
        modalState={showUpdateModal}
        closeModal={() => {
          setShowUpdateModal(false);
        }}
        onSubmit={handleSubmitSchedule}
      />

      {/* Delete Modal */}
      <DeleteModal
        counselor={selectedCounselor}
        modalState={showDeleteModal}
        closeModal={() => {
          setShowDeleteModal(false);
        }}
        onSubmit={handleSubmitSchedule}
      />

      {/* Link Modal */}
      <LinkModal
        counselor={selectedCounselor}
        consultationMethod={selectedMethod}
        transactionId={selectedTransactionId}
        modalState={showLinkModal}
        closeModal={() => {
          setShowLinkModal(false);
        }}
        onSubmit={handleSumbitTransaction}
      />
      {/* Cancel Modal */}
      <CancelModal
        transactionId={selectedTransactionId}
        modalState={showCancelModal}
        closeModal={() => {
          setShowCancelModal(false);
        }}
        onSubmit={handleSumbitTransaction}
      />

      {/* Page Select */}
      <div className="flex flex-row justify-between items-center">
        <form className="w-[360px]">
          <DropdownPage
            control={control}
            name={"pageStatus"}
            label={"Choose Sub Menu : "}
            placeholder={"Counseling's Schedule"}
            handleSelect={handleSelect}
          >
            <option value={true} label="Counseling's Schedule" />
            <option value={false} label="Counseling's Transaction" />
          </DropdownPage>
        </form>
        {isSchedule && (
          <ButtonPrimary
            onClick={() => {
              setShowScheduleModal(true);
            }}
            className="flex items-center justify-center text-sm"
          >
            <Add className="mr-1" style={{ fontSize: "1.125rem" }} />
            <span>Add Schedule</span>
          </ButtonPrimary>
        )}
      </div>

      {/* TABLE */}
      <TableContainer>
        <TableTitle
          title={`Counseling's ${isSchedule ? "Schedule" : "Transaction"}`}
          // Search
          onChange={
            isSchedule
              ? (e) => handleScheduleSearch(e)
              : (e) => handleTransactionSearch(e)
          }
          // SortBy
          sortBy={isSchedule ? scheduleSortBy : transactionSortBy}
          onSelect={
            isSchedule
              ? (e) => handleScheduleSortBy(e)
              : (e) => handleTransactionSortBy(e)
          }
        />

        <Tables scroll={!isSchedule}>
          {isSchedule ? (
            <TableHeader>
              <th className="w-[130px]">Counselor Id</th>
              <th className="w-[130px]">Counselor's Name</th>
              <th className="w-[130px]">Topic</th>
              <th className="w-[130px]">Update</th>
              <th className="w-[130px]">View</th>
              <th className="w-[130px]">Delete</th>
            </TableHeader>
          ) : (
            <TableHeader>
              <th className="w-[130px]">Date</th>
              <th className="w-[130px]">Transaction Id</th>
              <th className="w-[130px]">User Id</th>
              <th className="w-[130px]">Counselor Id</th>
              <th className="w-[130px]">Counselor's Name</th>
              <th className="w-[130px]">Method</th>
              <th className="w-[130px]">Topic</th>
              <th className="w-[130px]">Time</th>
              <th className="w-[130px]">Price</th>
              <th className="w-[130px]">Status</th>
              <th className="w-[130px]">Link</th>
              <th className="w-[130px]">Cancel</th>
            </TableHeader>
          )}

          {/* Schedule Table */}
          {isSchedule && (
            <TableBody>
              {counselors.length >= 1 ? (
                counselors.map((counselor) => (
                  <TableRow key={counselor.id}>
                    {isLoading ? (
                      <td colSpan={6}>
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          width="100%"
                          height={50}
                        />
                      </td>
                    ) : (
                      <>
                        <td className="w-[130px]">{hideId(counselor.id)}</td>
                        <td className="w-[130px]">{counselor.name}</td>
                        <td className="w-[130px]">{counselor.topic}</td>
                        <td className="w-[130px]">
                          <ButtonPrimary
                            className="max-w-[130px] w-[90%]"
                            onClick={() => {
                              setShowUpdateModal(true);
                              setSelectedCounselor(counselor);
                            }}
                          >
                            <Edit
                              className="mr-1"
                              style={{ fontSize: "1.125rem" }}
                            />
                            <span>Update</span>
                          </ButtonPrimary>
                        </td>
                        <td className="w-[130px]">
                          <ButtonPrimary
                            className="max-w-[130px] w-[90%]"
                            onClick={() => {
                              setShowViewModal(true);
                              setSelectedCounselor(counselor);
                            }}
                          >
                            <Visibility
                              className="mr-1"
                              style={{ fontSize: "1.125rem" }}
                            />
                            <span>View</span>
                          </ButtonPrimary>
                        </td>
                        <td className="w-[130px]">
                          <ButtonOutline
                            className="max-w-[130px] w-[90%]"
                            onClick={() => {
                              setShowDeleteModal(true);
                              setSelectedCounselor(counselor);
                            }}
                          >
                            <Delete
                              className="mr-1"
                              style={{ fontSize: "1.125rem" }}
                            />
                            <span>Delete</span>
                          </ButtonOutline>
                        </td>
                      </>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td className="text-center font-semibold" colSpan={6}>
                    {notFoundMsg}
                  </td>
                </TableRow>
              )}
            </TableBody>
          )}

          {/* Transaction Table */}
          {!isSchedule && (
            <TableBody>
              {transactions.length >= 1 ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    {isLoading ? (
                      <td colSpan={12}>
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          width="100%"
                          height={50}
                        />
                      </td>
                    ) : (
                      <>
                        <td className="w-[130px]">
                          {convertDate(transaction.created_at, " / ", true)}
                        </td>
                        <td className="w-[130px]">{hideId(transaction.id)}</td>
                        <td className="w-[130px]">
                          {hideId(transaction.user_id)}
                        </td>
                        <td className="w-[130px]">
                          {hideId(transaction.counselor_id)}
                        </td>
                        <td className="w-[130px]">
                          {transaction.counselor_data.name}
                        </td>
                        <td className="w-[130px]">
                          {transaction.consultation_method}
                        </td>
                        <td className="w-[130px]">
                          {transaction.counselor_data.topic}
                        </td>
                        <td className="w-[130px]">
                          {convertTime(transaction.time_start)}
                        </td>
                        <td className="w-[130px]">
                          {formatCurrency(transaction.counselor_data.price)}
                        </td>
                        <td className="w-[130px]">
                          <StatusTag type={transaction.status} />
                        </td>
                        <td className="w-[130px]">
                          {transaction.status == "pending" ||
                          transaction.status == "ongoing" ? (
                            <ButtonOutline
                              className="max-w-[130px] w-[90%]"
                              onClick={() => {
                                setShowLinkModal(true);
                                setSelectedTransactionId(transaction.id);
                                setSelectedCounselor(
                                  transaction.counselor_data
                                );
                                setSelectedMethod(
                                  transaction.consultation_method
                                );
                              }}
                            >
                              <Link
                                className="mr-1"
                                style={{ fontSize: "1.125rem" }}
                              />
                              <span>Send Link</span>
                            </ButtonOutline>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td className="w-[130px]">
                          {transaction.status == "pending" ||
                          transaction.status == "ongoing" ||
                          transaction.status == "waiting" ? (
                            <span
                              className="cursor-pointer text-dangerMain"
                              onClick={() => {
                                setShowCancelModal(true);
                                setSelectedTransactionId(transaction.id);
                              }}
                            >
                              cancel
                            </span>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                      </>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td className="text-center font-semibold" colSpan={9}>
                    {notFoundMsg}
                  </td>
                </TableRow>
              )}
            </TableBody>
          )}
        </Tables>
        {isSchedule && counselors.length >= 1 && (
          <PaginationTable
            page={currentSchedulePages}
            rows={totalSchedulePages}
            rowsPerPage={rowsPerSchedulePage}
            handleChangePage={(event, currentSchedulePages) => {
              setCurrentSchedulePages(currentSchedulePages);
              fetchAllCounselors({
                page: currentSchedulePages,
                has_schedule: true,
                sort_by: scheduleSortBy,
                limit: rowsPerSchedulePage,
              });
            }}
            handleChangeRowsPerPage={(event) => {
              setRowsPerSchedulePage(parseInt(event.target.value, 10));
              setCurrentSchedulePages(1);
              setScheduleSearchParams("");
              fetchAllCounselors({
                limit: parseInt(event.target.value, 10),
                page: currentSchedulePages,
                has_schedule: true,
                sort_by: scheduleSortBy,
              });
            }}
          />
        )}
        {!isSchedule && transactions.length >= 1 && (
          <PaginationTable
            page={currentTransactionPages}
            rows={totalTransactionPages}
            rowsPerPage={rowsPerTransactionPage}
            handleChangePage={(event, currentTransactionPages) => {
              setCurrentTransactionPages(currentTransactionPages);
              fetchAllTransactions({
                page: currentTransactionPages,
                sort_by: transactionSortBy,
                limit: rowsPerTransactionPage,
              });
            }}
            handleChangeRowsPerPage={(event) => {
              setRowsPerTransactionPage(parseInt(event.target.value, 10));
              setCurrentTransactionPages(1);
              setTransactionSearchParams("");
              fetchAllTransactions({
                limit: parseInt(event.target.value, 10),
                page: currentTransactionPages,
                sort_by: transactionSortBy,
              });
            }}
          />
        )}
      </TableContainer>
    </div>
  );
};

export default CounselingPage;
