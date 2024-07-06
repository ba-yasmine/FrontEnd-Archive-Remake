import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Pagination from '../../components/paginationComponent';
import { UserContext } from "../../App";
import Spinner from 'react-bootstrap/Spinner';
import NavAdmin from '../../components/NavbarAdmin';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import CompanyDepartements from '../../components/CompanyDepartementsModal';
import CompanyProvenances from '../../components/CompanyProvenancesModal';
import CreateCompany from '../../components/CreateCompanyModal';
import CompanyContract from '../../components/CompanyContracts';
import { headerTitleContext } from '../../Layout/layout';
import NoResults from '../../components/noResultsFound';
import WareHousesModal from '../../components/ManageWareHouses';

const ITEMS_PER_PAGE = 10;

const GestionSocietes = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { setheaderTitle, setheaderArrow } = useContext(headerTitleContext);
  const [isMobile, setIsMobile] = useState(false);
  const searchIco = <FontAwesomeIcon style={{ color: '#0243cd' }} icon={faSearch} />;
  const [loading, isLoading] = useState(true);
  const { userAuth, setUserAuth } = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState();
  const [brand, setBrand] = useState();
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [sortString, setSortString] = useState('');
  const sortIco = <FontAwesomeIcon icon={faSort} />;

  useEffect(() => {
    setheaderTitle('Gestion des sociétés');
    setheaderArrow(false);
  }, [setheaderTitle, setheaderArrow]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 925) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await axios.get(`${process.env.REACT_APP_HOST_VAR}rest/company/getCompaniesPaginated`, {
        params: {
          searchTerm,
          sortString,
          page: currentPage,
          size: 10,
        },
        headers: { 'Authorization': "Bearer" + userAuth.token }
      });

      isLoading(false);
      setItems(response.data.content);
      setTotalPages(response.data.totalPages);
    };
    fetchItems();
  }, [searchTerm, category, brand, currentPage, sortString, itemsPerPage, userAuth.token]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  return (
    <div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${isMobile ? '70px 10px' : '10px 30px'}`, gap: "10px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <WareHousesModal />
            <CreateCompany />
          </div>
          <div>
            <InputGroup>
              <InputGroup.Text id="basic-addon1">{searchIco}</InputGroup.Text>
              <Form.Control
                value={searchTerm}
                onChange={handleSearch}
                placeholder="rechercher une société"
                aria-label="Search"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </div>
        </div>
        <hr />
        {loading === true ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: "100px" }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : items.length !== 0 ? (
          <div style={{ borderRadius: "10px", width: "95%", margin: "auto", backgroundColor: "white", color: "#0243cd", marginBottom: "30px", marginTop: "40px" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Form.Select style={{ width: '200px' }} onChange={(e) => { setItemsPerPage(e.target.value); setCurrentPage(0); }} aria-label="Default select example">
                <option value='10'>10</option>
                <option value='25'>25</option>
                <option value='50'>50</option>
                <option value='100'>100</option>
              </Form.Select>
            </div>
            <Table style={{ borderRadius: "10px", width: "100%", margin: "auto"}} responsive>
              <thead style={{ height: "60px", fontSize: "17px" }}>
                <tr>
                  <th style={{ fontWeight: "600" }}>Société<button style={{ border: "none", background: "none", color: "#0243cd" }} onClick={() => setSortString('nomSociété')}></button></th>
                  <th style={{ fontWeight: "600", whiteSpace: "nowrap" }}>Contact Principal<button style={{ border: "none", background: "none", color: "#0243cd" }} onClick={() => setSortString('contactprincipal')}></button></th>
                  <th style={{ fontWeight: "600" }}>Email<button style={{ border: "none", background: "none", color: "#0243cd" }} onClick={() => setSortString('email')}></button></th>
                  <th style={{ fontWeight: "600" }}>Adresse</th>
                  <th style={{ fontWeight: "600", whiteSpace: "nowrap" }}>Téléphone<button style={{ border: "none", background: "none", color: "#0243cd" }} onClick={() => setSortString('numerotel')}></button></th>
                  <th style={{ fontWeight: "600" }}>Provenances<button style={{ border: "none", background: "none", color: "#0243cd" }}></button></th>
                  <th style={{ fontWeight: "600" }}>Contrats</th>
                  <th style={{ fontWeight: "600" }}>Départements</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? items.map((el, id) => (
                  <tr key={id}>
                    <td>{el?.nomSociete}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{el?.contactprincipal}</td>
                    <td>{el?.email}</td>
                    <td>{el?.siege}, {el?.codepostale}, {el?.commune?.designation_fr}, {el?.willaya?.designation_fr}</td>
                    <td>{el?.numerotel}</td>
                    <td><CompanyProvenances companyId={el.id} /></td>
                    <td><CompanyContract company={el} /></td>
                    <td><CompanyDepartements companyId={el} /></td>
                  </tr>
                )) : <tr><td colSpan="8">Fin des résultats</td></tr>}
              </tbody>
            </Table>
            <br />
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        ) : <NoResults />}
      </div>
    </div>
  );
}

export default GestionSocietes;
