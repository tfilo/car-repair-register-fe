--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: sk-SK-x-icu; Type: COLLATION; Schema: public; Owner: -
--

CREATE COLLATION public."sk-SK-x-icu" (provider = libc, locale = 'sk_SK.utf8');


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: attachment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attachment (
    id bigint NOT NULL,
    creator character varying(36) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    modified_at timestamp without time zone,
    deleted_at timestamp without time zone,
    name character varying(255) NOT NULL,
    mime_type character varying(255) NOT NULL,
    repair_log_id bigint NOT NULL,
    file_name VARCHAR(36) NOT NULL
);


--
-- Name: customer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer (
    id bigint NOT NULL,
    creator character varying(36) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    modified_at timestamp without time zone,
    deleted_at timestamp without time zone,
    name character varying(64) NOT NULL COLLATE pg_catalog."sk-SK-x-icu",
    surname character varying(64) COLLATE pg_catalog."sk-SK-x-icu",
    mobile character varying(20),
    email character varying(320)
);


--
-- Name: flyway_schema_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flyway_schema_history (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


--
-- Name: repair_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.repair_log (
    id bigint NOT NULL,
    creator character varying(36) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    modified_at timestamp without time zone,
    deleted_at timestamp without time zone,
    content character varying(5000) NOT NULL COLLATE pg_catalog."sk-SK-x-icu",
    repair_date date NOT NULL,
    vehicle_id bigint NOT NULL,
    odometer integer
);


--
-- Name: sq_attachment; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sq_attachment
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sq_customer; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sq_customer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sq_repair_log; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sq_repair_log
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sq_vehicle; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sq_vehicle
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vehicle; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicle (
    id bigint NOT NULL,
    creator character varying(36) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    modified_at timestamp without time zone,
    deleted_at timestamp without time zone,
    registration_plate character varying(20) NOT NULL,
    customer_id bigint NOT NULL,
    vin character varying(20),
    engine_code character varying(20),
    fuel_type character varying(20),
    engine_power integer,
    engine_volume integer,
    battery_capacity integer,
    brand character varying(64) COLLATE pg_catalog."sk-SK-x-icu",
    model character varying(64) COLLATE pg_catalog."sk-SK-x-icu",
    year_of_manufacture integer
);


--
-- Data for Name: attachment; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.attachment (id, creator, created_at, modified_at, deleted_at, name, mime_type, repair_log_id, file_name) VALUES (1, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-19 09:36:38.69173', NULL, NULL, 'faktura.pdf', 'application/pdf', 3, '45b0e0ad-3842-4008-b6ee-41ff9a3f85e3');
INSERT INTO public.attachment (id, creator, created_at, modified_at, deleted_at, name, mime_type, repair_log_id, file_name) VALUES (2, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-19 09:36:58.58207', NULL, NULL, 'faktura.txt', 'text/plain', 1, 'a01fe050-1d1c-4d81-ba81-798aa58aaf6d');
INSERT INTO public.attachment (id, creator, created_at, modified_at, deleted_at, name, mime_type, repair_log_id, file_name) VALUES (3, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-19 09:36:58.608126', NULL, NULL, 'faktura.pdf', 'application/pdf', 1, '676da29b-05d5-4227-a07c-9d1f5b74eb0b');


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.customer (id, creator, created_at, modified_at, deleted_at, name, surname, mobile, email) VALUES (1, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:16:46.114621', NULL, NULL, 'Ján', 'Horák', '0900100100', 'jan.horak@email.test');
INSERT INTO public.customer (id, creator, created_at, modified_at, deleted_at, name, surname, mobile, email) VALUES (2, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:17:23.013363', NULL, NULL, 'František', 'Konečný', '0900100101', 'frantisek.konecny@email.test');
INSERT INTO public.customer (id, creator, created_at, modified_at, deleted_at, name, surname, mobile, email) VALUES (3, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:17:53.826568', NULL, NULL, 'Dávid', 'Suchý', '0900100102', 'david.suchy@email.test');
INSERT INTO public.customer (id, creator, created_at, modified_at, deleted_at, name, surname, mobile, email) VALUES (4, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:18:16.674616', NULL, NULL, 'Alžbeta', 'Sokolová', NULL, NULL);
INSERT INTO public.customer (id, creator, created_at, modified_at, deleted_at, name, surname, mobile, email) VALUES (5, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:18:36.045287', NULL, NULL, 'Dagmar', 'Balážová', NULL, 'dagmar.b@email.test');
INSERT INTO public.customer (id, creator, created_at, modified_at, deleted_at, name, surname, mobile, email) VALUES (6, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:18:55.739409', NULL, NULL, 'Martin', 'Krátky', '0900101000', NULL);
INSERT INTO public.customer (id, creator, created_at, modified_at, deleted_at, name, surname, mobile, email) VALUES (7, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:19:06.293797', NULL, NULL, 'Ferdinant', NULL, NULL, NULL);
INSERT INTO public.customer (id, creator, created_at, modified_at, deleted_at, name, surname, mobile, email) VALUES (8, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:19:13.988392', NULL, NULL, 'Matej', NULL, NULL, NULL);
INSERT INTO public.customer (id, creator, created_at, modified_at, deleted_at, name, surname, mobile, email) VALUES (9, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:19:31.029084', NULL, NULL, 'Ján', 'Novák', '0900101111', NULL);
INSERT INTO public.customer (id, creator, created_at, modified_at, deleted_at, name, surname, mobile, email) VALUES (10, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:19:48.73523', NULL, NULL, 'Martin', 'Novák', NULL, 'novak.martin@email.test');
INSERT INTO public.customer (id, creator, created_at, modified_at, deleted_at, name, surname, mobile, email) VALUES (11, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:20:17.976295', NULL, NULL, 'Jozef', NULL, NULL, NULL);
INSERT INTO public.customer (id, creator, created_at, modified_at, deleted_at, name, surname, mobile, email) VALUES (12, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:20:40.784167', NULL, NULL, 'Emília', 'Holubová', NULL, 'emilia@email.test');
INSERT INTO public.customer (id, creator, created_at, modified_at, deleted_at, name, surname, mobile, email) VALUES (13, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:20:58.284582', NULL, NULL, 'Pavol', NULL, '0900001001', NULL);


--
-- Data for Name: flyway_schema_history; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) VALUES (1, '1', '', 'SQL', 'V1__.sql', -1876671062, 'evidence', '2024-12-27 07:18:22.450715', 31, true);
INSERT INTO public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) VALUES (2, '2', 'constrains and odometer', 'SQL', 'V2__constrains_and_odometer.sql', 201013779, 'evidence', '2025-01-01 14:51:22.432607', 11, true);
INSERT INTO public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) VALUES (3, '3', 'add attachment file name','SQL', 'V3__add_attachment_file_name.sql', 1746045734, 'evidence' ,'2026-06-26 19:50:29.049172', 0, true);
INSERT INTO public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) VALUES (4, '4', 'remove file', 'SQL', 'V4__remove_file.sql', -2035826893, 'evidence', '2026-06-26 19:50:29.053284', 2, true);

--
-- Data for Name: repair_log; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.repair_log (id, creator, created_at, modified_at, deleted_at, content, repair_date, vehicle_id, odometer) VALUES (1, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-19 09:28:07.043678', NULL, NULL, 'Výmena oleja', '2011-02-15', 1, 12030);
INSERT INTO public.repair_log (id, creator, created_at, modified_at, deleted_at, content, repair_date, vehicle_id, odometer) VALUES (2, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-19 09:28:45.024471', NULL, NULL, 'Prezutie na letné pneu', '2011-05-04', 1, 14500);
INSERT INTO public.repair_log (id, creator, created_at, modified_at, deleted_at, content, repair_date, vehicle_id, odometer) VALUES (3, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-19 09:29:22.456882', NULL, NULL, 'Výmena filtrov', '2013-08-20', 1, 18947);
INSERT INTO public.repair_log (id, creator, created_at, modified_at, deleted_at, content, repair_date, vehicle_id, odometer) VALUES (4, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-19 09:30:00.813261', NULL, NULL, 'Oprava výfukového potrubia', '2020-11-10', 7, 148954);
INSERT INTO public.repair_log (id, creator, created_at, modified_at, deleted_at, content, repair_date, vehicle_id, odometer) VALUES (5, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-19 09:30:29.164255', NULL, NULL, 'Diagnostika', '2010-06-18', 10, 20480);
INSERT INTO public.repair_log (id, creator, created_at, modified_at, deleted_at, content, repair_date, vehicle_id, odometer) VALUES (6, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-19 09:30:52.960125', NULL, NULL, 'Oprava kúrenia', '1999-01-01', 4, 87568);
INSERT INTO public.repair_log (id, creator, created_at, modified_at, deleted_at, content, repair_date, vehicle_id, odometer) VALUES (7, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-19 09:31:14.657999', NULL, NULL, 'Výmena rozvodov', '2018-12-05', 12, 189000);
INSERT INTO public.repair_log (id, creator, created_at, modified_at, deleted_at, content, repair_date, vehicle_id, odometer) VALUES (8, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-19 09:31:46.747265', NULL, NULL, 'Vyváženie kolies', '2014-10-18', 14, 45000);
INSERT INTO public.repair_log (id, creator, created_at, modified_at, deleted_at, content, repair_date, vehicle_id, odometer) VALUES (9, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-19 09:32:13.51917', NULL, NULL, 'Vyváženie kolies', '2012-03-14', 14, 20800);
INSERT INTO public.repair_log (id, creator, created_at, modified_at, deleted_at, content, repair_date, vehicle_id, odometer) VALUES (10, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-19 09:32:57.863053', NULL, NULL, 'Výmena svetlometu', '2024-12-20', 10, 99000);
INSERT INTO public.repair_log (id, creator, created_at, modified_at, deleted_at, content, repair_date, vehicle_id, odometer) VALUES (11, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-19 09:33:33.565213', '2025-01-19 09:33:47.767486', NULL, 'Prehliadka pred STK/EK', '2025-01-03', 12, 250866);


--
-- Data for Name: vehicle; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.vehicle (id, creator, created_at, modified_at, deleted_at, registration_plate, customer_id, vin, engine_code, fuel_type, engine_power, engine_volume, battery_capacity, brand, model, year_of_manufacture) VALUES (1, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:22:47.639479', NULL, NULL, 'AA001AA', 4, 'VIN0000000000001', 'XYZ111', 'Benzin', 88, 1500, NULL, 'Super', 'Vozidlo', 2000);
INSERT INTO public.vehicle (id, creator, created_at, modified_at, deleted_at, registration_plate, customer_id, vin, engine_code, fuel_type, engine_power, engine_volume, battery_capacity, brand, model, year_of_manufacture) VALUES (2, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:23:06.148447', NULL, NULL, 'AA002AA', 4, NULL, NULL, NULL, NULL, NULL, 66, NULL, NULL, NULL);
INSERT INTO public.vehicle (id, creator, created_at, modified_at, deleted_at, registration_plate, customer_id, vin, engine_code, fuel_type, engine_power, engine_volume, battery_capacity, brand, model, year_of_manufacture) VALUES (3, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:24:07.968567', NULL, NULL, 'AB000AA', 5, 'VIN999999888', 'KOD8988', 'Elektrika', 154, NULL, 78, 'Nové', 'Vozidlo', 2023);
INSERT INTO public.vehicle (id, creator, created_at, modified_at, deleted_at, registration_plate, customer_id, vin, engine_code, fuel_type, engine_power, engine_volume, battery_capacity, brand, model, year_of_manufacture) VALUES (4, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:24:23.280889', NULL, NULL, 'AC000AA', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.vehicle (id, creator, created_at, modified_at, deleted_at, registration_plate, customer_id, vin, engine_code, fuel_type, engine_power, engine_volume, battery_capacity, brand, model, year_of_manufacture) VALUES (5, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:24:38.47892', NULL, NULL, 'EE001HH', 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.vehicle (id, creator, created_at, modified_at, deleted_at, registration_plate, customer_id, vin, engine_code, fuel_type, engine_power, engine_volume, battery_capacity, brand, model, year_of_manufacture) VALUES (6, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:25:05.099423', NULL, NULL, 'FF001AA', 7, 'VIN777444555', NULL, 'Benzin', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.vehicle (id, creator, created_at, modified_at, deleted_at, registration_plate, customer_id, vin, engine_code, fuel_type, engine_power, engine_volume, battery_capacity, brand, model, year_of_manufacture) VALUES (7, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:25:19.085656', NULL, NULL, 'AA001BB', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.vehicle (id, creator, created_at, modified_at, deleted_at, registration_plate, customer_id, vin, engine_code, fuel_type, engine_power, engine_volume, battery_capacity, brand, model, year_of_manufacture) VALUES (8, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:25:34.532879', NULL, NULL, 'AA002AA', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.vehicle (id, creator, created_at, modified_at, deleted_at, registration_plate, customer_id, vin, engine_code, fuel_type, engine_power, engine_volume, battery_capacity, brand, model, year_of_manufacture) VALUES (9, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:25:49.331494', NULL, NULL, 'CC111CC', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.vehicle (id, creator, created_at, modified_at, deleted_at, registration_plate, customer_id, vin, engine_code, fuel_type, engine_power, engine_volume, battery_capacity, brand, model, year_of_manufacture) VALUES (10, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:26:01.532605', NULL, NULL, 'AA002AA', 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.vehicle (id, creator, created_at, modified_at, deleted_at, registration_plate, customer_id, vin, engine_code, fuel_type, engine_power, engine_volume, battery_capacity, brand, model, year_of_manufacture) VALUES (11, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:26:19.869816', NULL, NULL, 'BB222CC', 11, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.vehicle (id, creator, created_at, modified_at, deleted_at, registration_plate, customer_id, vin, engine_code, fuel_type, engine_power, engine_volume, battery_capacity, brand, model, year_of_manufacture) VALUES (12, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:26:50.741905', NULL, NULL, 'BB444AA', 6, NULL, NULL, 'Nafta', 90, 1600, NULL, NULL, NULL, 1999);
INSERT INTO public.vehicle (id, creator, created_at, modified_at, deleted_at, registration_plate, customer_id, vin, engine_code, fuel_type, engine_power, engine_volume, battery_capacity, brand, model, year_of_manufacture) VALUES (13, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:27:10.146502', NULL, NULL, 'GG999AA', 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.vehicle (id, creator, created_at, modified_at, deleted_at, registration_plate, customer_id, vin, engine_code, fuel_type, engine_power, engine_volume, battery_capacity, brand, model, year_of_manufacture) VALUES (14, '3c001cac-23e4-412f-91ab-91b290d6a755', '2025-01-17 20:27:59.114473', NULL, NULL, 'BB987CC', 13, NULL, NULL, 'Elektrika', NULL, NULL, 90, NULL, NULL, NULL);


--
-- Name: sq_attachment; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sq_attachment', 3, true);


--
-- Name: sq_customer; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sq_customer', 13, true);


--
-- Name: sq_repair_log; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sq_repair_log', 11, true);


--
-- Name: sq_vehicle; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sq_vehicle', 14, true);


--
-- Name: flyway_schema_history flyway_schema_history_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);


--
-- Name: attachment pk_attachment; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attachment
    ADD CONSTRAINT pk_attachment PRIMARY KEY (id);


--
-- Name: customer pk_customer; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT pk_customer PRIMARY KEY (id);


--
-- Name: repair_log pk_repair_log; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_log
    ADD CONSTRAINT pk_repair_log PRIMARY KEY (id);


--
-- Name: vehicle pk_vehicle; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle
    ADD CONSTRAINT pk_vehicle PRIMARY KEY (id);


--
-- Name: repair_log uc_repair_log_repair; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_log
    ADD CONSTRAINT uc_repair_log_repair UNIQUE NULLS NOT DISTINCT (repair_date, vehicle_id, deleted_at);


--
-- Name: vehicle uc_vehicle_registration_plate; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle
    ADD CONSTRAINT uc_vehicle_registration_plate UNIQUE NULLS NOT DISTINCT (customer_id, registration_plate, deleted_at);


--
-- Name: flyway_schema_history_s_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flyway_schema_history_s_idx ON public.flyway_schema_history USING btree (success);


--
-- Name: attachment fk_attachment_on_repair_log; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attachment
    ADD CONSTRAINT fk_attachment_on_repair_log FOREIGN KEY (repair_log_id) REFERENCES public.repair_log(id);


--
-- Name: repair_log fk_repair_log_on_vehicle; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_log
    ADD CONSTRAINT fk_repair_log_on_vehicle FOREIGN KEY (vehicle_id) REFERENCES public.vehicle(id);


--
-- Name: vehicle fk_vehicle_on_customer; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle
    ADD CONSTRAINT fk_vehicle_on_customer FOREIGN KEY (customer_id) REFERENCES public.customer(id);


--
-- PostgreSQL database dump complete
--

