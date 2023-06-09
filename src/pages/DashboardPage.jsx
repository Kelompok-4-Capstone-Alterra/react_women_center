import { useEffect, useState } from "react";
import Card from "../components/Card";
import TableContainer from "../components/Dashboard/Tables/TableContainer";
import TableTitle from "../components/Dashboard/Tables/TableTitle";
import Tables from "../components/Dashboard/Tables/Tables";
import TableHeader from "../components/Dashboard/Tables/TableHeader";
import TableBody from "../components/Dashboard/Tables/TableBody";
import TableRow from "../components/Dashboard/Tables/TableRow";
import PaginationTable from "../components/PaginationTable";
import GroupsIcon from "@mui/icons-material/Groups";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import StatusTag from "../components/StatusTag";
import { getAllTransactions } from "../api/transaction";
import { formatCurrency } from "../helpers/formatCurrency";
import { convertDate } from "../helpers/convertDate";
import { convertTime } from "../helpers/converTime";
import { hideId } from "../helpers/hideId";
import { getStatistics } from "../api/statistics";
import { Skeleton } from "@mui/material";

const DashboardPage = () => {
  const [statistics, setStatistics] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [transactionSearchParams, setTransactionSearchParams] = useState("");
  const [transactionSortBy, setTransactionSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);
  const [notFoundMsg, setNotFoundMsg] = useState("");
  const [currentTransactionPages, setCurrentTransactionPages] = useState("");
  const [totalTransactionPages, setTotalTransactionPages] = useState("");
  const [rowsPerTransactionPage, setRowsPerTransactionPage] = useState(10);

  const handleTransactionSearch = (e) => {
    const transactionSearchParams = e.target.value;
    setTransactionSearchParams(transactionSearchParams);
    fetchAllTransactions({
      search: transactionSearchParams,
      sort_by: transactionSortBy,
    });
  };
  const handleTransactionSortBy = (e) => {
    const transactionSortBy = e.target.value;
    setTransactionSortBy(transactionSortBy);
    fetchAllTransactions({
      search: transactionSearchParams,
      sort_by: transactionSortBy,
    });
  };

  const fetchAllStatistics = async () => {
    setIsLoading(true);

    try {
      const response = await getStatistics();
      setStatistics(response);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
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

  useEffect(() => {
    fetchAllStatistics();
    fetchAllTransactions({
      sort_by: transactionSortBy,
      search: transactionSearchParams,
      limit: rowsPerTransactionPage,
      page: currentTransactionPages,
    });
  }, []);

  return (
    <>
      <div className="flex gap-5 mb-10">
        <Card
          title="Total Users"
          amount={statistics.total_user}
          icon={<GroupsIcon style={{ fontSize: "45px" }} />}
        ></Card>
        <Card
          title="Total Counselors"
          amount={statistics.total_counselor}
          icon={<GroupsIcon style={{ fontSize: "45px" }} />}
        ></Card>
        <Card
          title="Total Transactions"
          amount={statistics.total_transaction}
          icon={<ShoppingBagRoundedIcon style={{ fontSize: "45px" }} />}
        ></Card>
      </div>
      <TableContainer>
        <TableTitle
          title={"Recent Counseling Transaction"}
          onChange={(e) => handleTransactionSearch(e)}
          sortBy={transactionSortBy}
          onSelect={(e) => handleTransactionSortBy(e)}
        />
        <Tables scroll>
          <TableHeader>
            <th className="w-[130px]">Date</th>
            <th className="w-[130px]">Transaction id</th>
            <th className="w-[130px]">User id</th>
            <th className="w-[130px]">Counselor id</th>
            <th className="w-[130px]">Counselor's Name</th>
            <th className="w-[130px]">Method</th>
            <th className="w-[130px]">Topic</th>
            <th className="w-[130px]">Time</th>
            <th className="w-[130px]">Price</th>
            <th className="w-[130px]">Status</th>
          </TableHeader>
          <TableBody>
            {transactions.length >= 1 ? (
              transactions.map((transaction, index) => (
                <TableRow key={index}>
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
                        {hideId(transaction.counselor_data.id)}
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
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td className="font-semibold text-center" colSpan={7}>
                  {notFoundMsg}
                </td>
              </TableRow>
            )}
          </TableBody>
        </Tables>
        {transactions.length >= 1 && (
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
    </>
  );
};

export default DashboardPage;
