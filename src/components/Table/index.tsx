import {
  Grid,
  Paper,
  styled,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { ReactNode } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface TableProps {
  titles: string[];
  data: ReactNode[][];
}

export const TableStyled = ({ titles, data = [] }: TableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {titles.map((title) => (
              <StyledTableCell key={title}>{title}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!!data.length &&
            data.map((row, index) => (
              <StyledTableRow key={index}>
                {row.map((cell, index) => (
                  <StyledTableCell key={index} component="th" scope="row">
                    {cell ?? "-"}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>

      {!data.length && (
        <Grid padding={"1em"} textAlign={"center"} width={"100%"}>
          <Typography>Nenhum dado encontrado.</Typography>
        </Grid>
      )}
    </TableContainer>
  );
};
