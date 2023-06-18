import React, { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import TableTitle from "../../components/Dashboard/Tables/TableTitle";
import TableContainer from "../../components/Dashboard/Tables/TableContainer";
import TableHeader from "../../components/Dashboard/Tables/TableHeader";
import Tables from "../../components/Dashboard/Tables/Tables";
import TableBody from "../../components/Dashboard/Tables/TableBody";
import TableRow from "../../components/Dashboard/Tables/TableRow";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import Dropdown from "../../components/Dropdown";
import StatusTag from "../../components/StatusTag/index";
import Modal from "../../components/Modal/index";
import InputField from "../../components/InputField";
import ButtonPrimary from "../../components/ButtonPrimary";
import ButtonOutline from "../../components/ButtonOutline/index";
import Calendar from "../../components/Calendar/index";
import ScheduleModal from "../../components/Dashboard/Counseling/ScheduleModal";
import UpdateModal from "../../components/Dashboard/Counseling/UpdateModal/index";
import ViewModal from "../../components/Dashboard/Counseling/ViewModal/index";
import DeleteModal from "../../components/Dashboard/Counseling/DeleteModal/index";
import LinkModal from "../../components/Dashboard/Counseling/LinkModal";
import CancelModal from "../../components/Dashboard/Counseling/CancelModal";

const CounselingPage = () => {
  const [isSchedule, setIsSchedule] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm();

  const handleSelect = () => {
    const formData = getValues();
    const dropdownValue = formData.pageStatus;
    setIsSchedule(dropdownValue.value);
    console.log("isShedule : ", isSchedule);

    console.log("Value: ", dropdownValue.value);
  };

  const handleModal = () => {
    console.log("clicked");
  };

  return (
    <div className="">
      {/* SCHEDULE MODAL */}
      <ScheduleModal
        modalState={showScheduleModal}
        closeModal={() => {
          setShowScheduleModal(false);
        }}
      />
      {/* VIEW MODA: */}
      <ViewModal
        modalState={showViewModal}
        closeModal={() => {
          setShowViewModal(false);
        }}
      />
      {/* Update Modal */}
      <UpdateModal
        modalState={showUpdateModal}
        closeModal={() => {
          setShowUpdateModal(false);
        }}
      />

      {/* Delete Modal */}
      <DeleteModal
        modalState={showDeleteModal}
        closeModal={() => {
          setShowDeleteModal(false);
        }}
      />

      {/* Link Modal */}
      <LinkModal
        modalState={showLinkModal}
        closeModal={() => {
          setShowLinkModal(false);
        }}
      />
      {/* Cancel Modal */}
      <CancelModal
        modalState={showCancelModal}
        closeModal={() => {
          setShowCancelModal(false);
        }}
      />

      <div className="flex px-[40px] items-center py-[26px] justify-between border-b-primaryBorder border-b-[0.25px] mb-10">
        <div className="flex items-center text-primaryMain">
          <PersonIcon className="me-4" />
          <p className="text-lg font-medium ">Admin</p>
        </div>
        {isSchedule && (
          <ButtonPrimary
            onClick={() => {
              setShowScheduleModal(true);
            }}
            className="flex items-center justify-center text-sm"
          >
            <AddIcon /> Add Schedule
          </ButtonPrimary>
        )}
      </div>
      <div className="px-[40px]">
        <div>
          <form className="w-[360px]">
            <Dropdown
              control={control}
              name={"pageStatus"}
              label={"Choose Sub Menu : "}
              placeholder={"Counseling's Schedule"}
              handleSelect={handleSelect}
            >
              <option value={true} label="Counseling's Schedule" />
              <option value={false} label="Counseling's Transaction" />
            </Dropdown>
          </form>
        </div>
        <TableContainer>
          <TableTitle
            title={`Counseling's ${isSchedule ? "Schedule" : "Transaction"}`}
          />
          <Tables scroll={!isSchedule}>
            {isSchedule ? (
              <TableHeader>
                <th className="w-[130px]">Counselor Id</th>
                <th className="w-[130px]">Counselor's Name</th>
                <th className="w-[130px]">Status</th>
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

            <TableBody>
              {isSchedule ? (
                <TableRow>
                  <td className="w-[130px]">123456</td>
                  <td className="w-[130px]">John Doe</td>
                  <td className="w-[130px]">
                    <StatusTag type={"available"} />
                  </td>
                  <td className="w-[130px]">Mental Health</td>
                  <td className="w-[130px]">
                    <ButtonPrimary
                      onClick={() => {
                        setShowUpdateModal(true);
                      }}
                    >
                      Update
                    </ButtonPrimary>
                  </td>
                  <td className="w-[130px]">
                    <ButtonPrimary
                      onClick={() => {
                        setShowViewModal(true);
                      }}
                    >
                      View
                    </ButtonPrimary>
                  </td>
                  <td className="w-[130px]">
                    <ButtonOutline
                      onClick={() => {
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </ButtonOutline>
                  </td>
                </TableRow>
              ) : (
                <TableRow>
                  <td className="w-[130px]">12 / 05 / 23</td>
                  <td className="w-[130px]">1234567</td>
                  <td className="w-[130px]">1234567</td>
                  <td className="w-[130px]">1234567</td>
                  <td className="w-[130px]">John Doe</td>
                  <td className="w-[130px]">Chat</td>
                  <td className="w-[130px]">Mental Health</td>
                  <td className="w-[130px]">12 : 00</td>
                  <td className="w-[130px]">Rp. 120.000</td>
                  <td className="w-[130px]">
                    <StatusTag type={"ongoing"} />
                  </td>
                  <td className="w-[130px]">
                    <ButtonOutline
                      onClick={() => {
                        setShowLinkModal(true);
                      }}
                    >
                      send Link
                    </ButtonOutline>
                  </td>
                  <td className="w-[130px]">
                    {" "}
                    <span
                      className="cursor-pointer text-dangerMain"
                      onClick={() => {
                        setShowCancelModal(true);
                      }}
                    >
                      cancel
                    </span>
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Tables>
        </TableContainer>
      </div>
    </div>
  );
};

export default CounselingPage;