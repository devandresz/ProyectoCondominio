-- =============================================================================
-- SCRIPT DE LIMPIEZA
-- Elimina todas las tablas, triggers e índices del esquema anterior
-- Ejecutar antes del DDL si ya existe una versión previa
-- =============================================================================

BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_ticket_historial';        EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_ticket_rol_valido';        EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_tercer_llamado_multa';     EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_desactivar_inv_normal';    EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_validar_invitacion';       EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_area_disponible';          EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_reserva_usuario_activo';   EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_reserva_sin_deuda';        EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_cargo_pagado';             EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_pago_todos_los_cargos';    EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_pago_usuario_vinculado';   EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_max_usuarios_propiedad';   EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_max_parqueos';             EXCEPTION WHEN OTHERS THEN NULL; END;
/

BEGIN EXECUTE IMMEDIATE 'DROP TABLE TICKET_HISTORIAL    CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE TICKET              CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE LLAMADO_ATENCION    CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE ACCESO_VISITANTE    CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE INVITACION          CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE AUDITORIA_RESERVA   CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE RESERVA             CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE PAGO_DETALLE        CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE PAGO                CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE CARGO               CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE USUARIO_PROPIEDAD   CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE PARQUEO             CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE PROPIEDAD           CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE USUARIO             CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE CONFIGURACION       CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE PRIORIDAD_TICKET    CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE TIPO_INVITACION     CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE TIPO_CARGO          CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE AREA_SOCIAL         CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE CATEGORIA_PROPIEDAD CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE ROL                 CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/


-- =============================================================================
-- ESQUEMA DE BASE DE DATOS - SISTEMA DE GESTIÓN DE CONDOMINIO
-- Motor: Oracle Database
-- Principio: DAG (sin dependencias circulares)
-- Versión: 3.0
-- =============================================================================


-- =============================================================================
-- NIVEL 0: TABLAS BASE (sin dependencias externas)
-- =============================================================================

-- Roles del sistema (RN-U1, RN-U2)
CREATE TABLE ROL (
    id_rol      NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre      VARCHAR2(50)    NOT NULL,
    descripcion VARCHAR2(200),
    activo      NUMBER(1)       DEFAULT 1 NOT NULL,
    CONSTRAINT chk_rol_activo CHECK (activo IN (0,1)),
    CONSTRAINT uq_rol_nombre  UNIQUE (nombre)
);

-- Categorías de propiedad — define cuota mensual y cantidad de parqueos (RN-P5)
CREATE TABLE CATEGORIA_PROPIEDAD (
    id_categoria    NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre          VARCHAR2(50)    NOT NULL,
    descripcion     VARCHAR2(200),
    max_parqueos    NUMBER(2)       NOT NULL,
    cuota_mensual   NUMBER(10,2)    NOT NULL,
    CONSTRAINT chk_cat_parqueos CHECK (max_parqueos >= 0),
    CONSTRAINT chk_cat_cuota    CHECK (cuota_mensual > 0),
    CONSTRAINT uq_cat_nombre    UNIQUE (nombre)
);

-- Áreas sociales predefinidas — no se pueden agregar (RN-A1, RN-A4)
CREATE TABLE AREA_SOCIAL (
    id_area         NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre          VARCHAR2(100)   NOT NULL,
    descripcion     VARCHAR2(300),
    hora_apertura   VARCHAR2(5)     DEFAULT '08:00' NOT NULL,
    hora_cierre     VARCHAR2(5)     DEFAULT '22:00' NOT NULL,
    precio_por_hora NUMBER(10,2)    NOT NULL,
    activo          NUMBER(1)       DEFAULT 1 NOT NULL,
    CONSTRAINT chk_area_activo  CHECK (activo IN (0,1)),
    CONSTRAINT chk_area_precio  CHECK (precio_por_hora >= 0),
    CONSTRAINT uq_area_nombre   UNIQUE (nombre)
);

-- Tipos de cargo financiero (RN-F1)
-- es_multa = 1: cargo de tipo multa con monto fijo del catálogo
-- es_multa = 0: monto calculado dinámicamente (cuota, mora, reserva)
CREATE TABLE TIPO_CARGO (
    id_tipo_cargo   NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre          VARCHAR2(50)    NOT NULL,
    descripcion     VARCHAR2(200),
    monto           NUMBER(10,2)    DEFAULT 0   NOT NULL,
    es_multa        NUMBER(1)       DEFAULT 0   NOT NULL,
    activo          NUMBER(1)       DEFAULT 1   NOT NULL,
    CONSTRAINT uq_tipo_cargo_nombre  UNIQUE (nombre),
    CONSTRAINT chk_tipo_cargo_monto  CHECK (monto >= 0),
    CONSTRAINT chk_tipo_cargo_multa  CHECK (es_multa IN (0,1)),
    CONSTRAINT chk_tipo_cargo_activo CHECK (activo IN (0,1))
);

-- Tipos de invitación (RN-I2)
CREATE TABLE TIPO_INVITACION (
    id_tipo     NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre      VARCHAR2(50)    NOT NULL,
    descripcion VARCHAR2(200),
    CONSTRAINT uq_tipo_inv_nombre UNIQUE (nombre)
);

-- Prioridades de ticket
CREATE TABLE PRIORIDAD_TICKET (
    id_prioridad    NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre          VARCHAR2(30)    NOT NULL,
    nivel           NUMBER(1)       NOT NULL,
    CONSTRAINT uq_prio_nombre UNIQUE (nombre),
    CONSTRAINT uq_prio_nivel  UNIQUE (nivel)
);

-- Configuración dinámica del sistema (RN-C1)
CREATE TABLE CONFIGURACION (
    id_config   NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clave       VARCHAR2(100)   NOT NULL,
    valor       VARCHAR2(500)   NOT NULL,
    descripcion VARCHAR2(300),
    tipo_dato   VARCHAR2(20)    DEFAULT 'STRING' NOT NULL,
    fecha_mod   DATE            DEFAULT SYSDATE  NOT NULL,
    CONSTRAINT uq_config_clave UNIQUE (clave),
    CONSTRAINT chk_config_tipo CHECK (tipo_dato IN ('STRING','NUMBER','DATE','BOOLEAN'))
);


-- =============================================================================
-- NIVEL 1: USUARIO (depende de ROL)
-- =============================================================================

-- Usuarios del sistema (RN-U1, RN-U3, RN-U4, RN-X2)
CREATE TABLE USUARIO (
    id_usuario      NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_rol          NUMBER          NOT NULL,
    nombre_usuario  VARCHAR2(50)    NOT NULL,   -- RN-U4: identificador de login
    nombre          VARCHAR2(100)   NOT NULL,
    apellido        VARCHAR2(100)   NOT NULL,
    correo          VARCHAR2(150)   NOT NULL,
    contrasena_hash VARCHAR2(300)   NOT NULL,
    telefono        VARCHAR2(20),
    activo          NUMBER(1)       DEFAULT 1   NOT NULL,
    fecha_creacion  DATE            DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_usuario_rol         FOREIGN KEY (id_rol) REFERENCES ROL(id_rol),
    CONSTRAINT uq_usuario_nombre_usu  UNIQUE (nombre_usuario),
    CONSTRAINT uq_usuario_correo      UNIQUE (correo),
    CONSTRAINT chk_usuario_activo     CHECK (activo IN (0,1))
);


-- =============================================================================
-- NIVEL 2: PROPIEDAD y PARQUEO (dependen de CATEGORIA_PROPIEDAD)
-- =============================================================================

-- Propiedades del condominio (RN-P1, RN-P3)
CREATE TABLE PROPIEDAD (
    id_propiedad        NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria        NUMBER          NOT NULL,
    numero_propiedad    VARCHAR2(20)    NOT NULL,
    descripcion         VARCHAR2(300),
    activo              NUMBER(1)       DEFAULT 1 NOT NULL,
    fecha_registro      DATE            DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_propiedad_cat FOREIGN KEY (id_categoria) REFERENCES CATEGORIA_PROPIEDAD(id_categoria),
    CONSTRAINT uq_propiedad_num UNIQUE (numero_propiedad),
    CONSTRAINT chk_prop_activo  CHECK (activo IN (0,1))
);

-- Parqueos de una propiedad (RN-P5)
CREATE TABLE PARQUEO (
    id_parqueo      NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_propiedad    NUMBER          NOT NULL,
    numero_parqueo  VARCHAR2(20)    NOT NULL,
    descripcion     VARCHAR2(200),
    activo          NUMBER(1)       DEFAULT 1 NOT NULL,
    CONSTRAINT fk_parqueo_prop    FOREIGN KEY (id_propiedad) REFERENCES PROPIEDAD(id_propiedad),
    CONSTRAINT uq_parqueo_num     UNIQUE (numero_parqueo),
    CONSTRAINT chk_parqueo_activo CHECK (activo IN (0,1))
);

-- Trigger: valida máximo de parqueos según categoría de propiedad (RN-P5)
CREATE OR REPLACE TRIGGER trg_max_parqueos
BEFORE INSERT ON PARQUEO
FOR EACH ROW
DECLARE
    v_max_parqueos  NUMBER;
    v_actuales      NUMBER;
BEGIN
    SELECT cp.max_parqueos INTO v_max_parqueos
    FROM PROPIEDAD p
    JOIN CATEGORIA_PROPIEDAD cp ON p.id_categoria = cp.id_categoria
    WHERE p.id_propiedad = :NEW.id_propiedad;

    SELECT COUNT(*) INTO v_actuales
    FROM PARQUEO
    WHERE id_propiedad = :NEW.id_propiedad AND activo = 1;

    IF v_actuales >= v_max_parqueos THEN
        RAISE_APPLICATION_ERROR(-20001,
            'RN-P5: La propiedad ya alcanzó el máximo de parqueos permitidos por su categoría.');
    END IF;
END;
/


-- =============================================================================
-- NIVEL 3: VINCULACIÓN USUARIO-PROPIEDAD (RN-U5, RN-P2, RN-P4)
-- =============================================================================

CREATE TABLE USUARIO_PROPIEDAD (
    id_usuario_propiedad    NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario              NUMBER          NOT NULL,
    id_propiedad            NUMBER          NOT NULL,
    tipo_vinculo            VARCHAR2(20)    NOT NULL,   -- 'Propietario' | 'Inquilino'
    fecha_inicio            DATE            DEFAULT SYSDATE NOT NULL,
    fecha_fin               DATE,
    activo                  NUMBER(1)       DEFAULT 1 NOT NULL,
    CONSTRAINT fk_up_usuario   FOREIGN KEY (id_usuario)   REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_up_propiedad FOREIGN KEY (id_propiedad) REFERENCES PROPIEDAD(id_propiedad),
    CONSTRAINT chk_up_vinculo  CHECK (tipo_vinculo IN ('Propietario','Inquilino')),
    CONSTRAINT chk_up_activo   CHECK (activo IN (0,1)),
    -- Solo un propietario y un inquilino activo por propiedad a la vez
    CONSTRAINT uq_up_tipo      UNIQUE (id_propiedad, tipo_vinculo)
);

-- Trigger: máximo 2 usuarios activos por propiedad (RN-U5)
CREATE OR REPLACE TRIGGER trg_max_usuarios_propiedad
BEFORE INSERT ON USUARIO_PROPIEDAD
FOR EACH ROW
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM USUARIO_PROPIEDAD
    WHERE id_propiedad = :NEW.id_propiedad AND activo = 1;

    IF v_count >= 2 THEN
        RAISE_APPLICATION_ERROR(-20002,
            'RN-U5: Una propiedad no puede tener más de 2 usuarios vinculados (propietario + inquilino).');
    END IF;
END;
/


-- =============================================================================
-- NIVEL 4: CARGOS FINANCIEROS (RN-F1, RN-F3)
-- =============================================================================

CREATE TABLE CARGO (
    id_cargo            NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_propiedad        NUMBER          NOT NULL,
    id_tipo_cargo       NUMBER          NOT NULL,
    monto               NUMBER(12,2)    NOT NULL,
    descripcion         VARCHAR2(300),
    estado              VARCHAR2(10)    DEFAULT 'PENDIENTE' NOT NULL,
    fecha_emision       DATE            DEFAULT SYSDATE NOT NULL,
    fecha_vencimiento   DATE,
    CONSTRAINT fk_cargo_propiedad FOREIGN KEY (id_propiedad)  REFERENCES PROPIEDAD(id_propiedad),
    CONSTRAINT fk_cargo_tipo      FOREIGN KEY (id_tipo_cargo) REFERENCES TIPO_CARGO(id_tipo_cargo),
    CONSTRAINT chk_cargo_estado   CHECK (estado IN ('PENDIENTE','PAGADO')),
    CONSTRAINT chk_cargo_monto    CHECK (monto >= 0)
);


-- =============================================================================
-- NIVEL 5: PAGOS (RN-F2, RN-F4, RN-F5, RN-F6, RN-F7)
-- =============================================================================

-- Cabecera del pago — una boleta cubre todos los cargos pendientes (RN-F7)
CREATE TABLE PAGO (
    id_pago         NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_propiedad    NUMBER          NOT NULL,
    id_usuario      NUMBER          NOT NULL,
    numero_boleta   VARCHAR2(100)   NOT NULL,
    monto_total     NUMBER(12,2)    NOT NULL,
    fecha_pago      DATE            DEFAULT SYSDATE NOT NULL,
    observaciones   VARCHAR2(300),
    CONSTRAINT fk_pago_propiedad FOREIGN KEY (id_propiedad) REFERENCES PROPIEDAD(id_propiedad),
    CONSTRAINT fk_pago_usuario   FOREIGN KEY (id_usuario)   REFERENCES USUARIO(id_usuario),
    CONSTRAINT uq_pago_boleta    UNIQUE (numero_boleta),
    CONSTRAINT chk_pago_monto    CHECK (monto_total > 0)
);

-- Detalle del pago — desglose por cargo
CREATE TABLE PAGO_DETALLE (
    id_detalle      NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pago         NUMBER          NOT NULL,
    id_cargo        NUMBER          NOT NULL,
    monto_aplicado  NUMBER(12,2)    NOT NULL,
    CONSTRAINT fk_pd_pago   FOREIGN KEY (id_pago)  REFERENCES PAGO(id_pago),
    CONSTRAINT fk_pd_cargo  FOREIGN KEY (id_cargo) REFERENCES CARGO(id_cargo),
    CONSTRAINT uq_pd_cargo  UNIQUE (id_cargo),
    CONSTRAINT chk_pd_monto CHECK (monto_aplicado > 0)
);

-- Trigger: valida que el usuario esté vinculado a la propiedad del pago (RN-F4)
CREATE OR REPLACE TRIGGER trg_pago_usuario_vinculado
BEFORE INSERT ON PAGO
FOR EACH ROW
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM USUARIO_PROPIEDAD
    WHERE id_usuario   = :NEW.id_usuario
      AND id_propiedad = :NEW.id_propiedad
      AND activo       = 1;

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20003,
            'RN-F4: Solo usuarios vinculados a la propiedad pueden registrar pagos.');
    END IF;
END;
/

-- Trigger: valida que el pago incluya TODOS los cargos pendientes ANTES de insertar (RN-F7)
-- Se ejecuta BEFORE para evitar el bug de leer cargos ya marcados como PAGADO
CREATE OR REPLACE TRIGGER trg_pago_todos_los_cargos
BEFORE INSERT ON PAGO_DETALLE
FOR EACH ROW
DECLARE
    v_pendientes_totales    NUMBER;
    v_incluidos_en_pago     NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_pendientes_totales
    FROM CARGO c
    JOIN PAGO p ON p.id_propiedad = c.id_propiedad
    WHERE p.id_pago  = :NEW.id_pago
      AND c.estado   = 'PENDIENTE'
      AND c.id_cargo <> :NEW.id_cargo;

    SELECT COUNT(*) INTO v_incluidos_en_pago
    FROM PAGO_DETALLE
    WHERE id_pago = :NEW.id_pago;

    IF v_pendientes_totales > v_incluidos_en_pago THEN
        RAISE_APPLICATION_ERROR(-20004,
            'RN-F7: El pago debe incluir todos los cargos pendientes de la propiedad.');
    END IF;
END;
/

-- Trigger: al registrar detalle de pago marca el cargo como PAGADO
CREATE OR REPLACE TRIGGER trg_cargo_pagado
AFTER INSERT ON PAGO_DETALLE
FOR EACH ROW
BEGIN
    UPDATE CARGO SET estado = 'PAGADO'
    WHERE id_cargo = :NEW.id_cargo;
END;
/


-- =============================================================================
-- NIVEL 6: RESERVAS (RN-R1 … RN-R8, RN-X4)
-- El pago de la reserva se registra en PAGO antes de crear la RESERVA
-- RESERVA guarda el numero_boleta como referencia visual (RN-X4)
-- =============================================================================

CREATE TABLE RESERVA (
    id_reserva      NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario      NUMBER          NOT NULL,
    id_area         NUMBER          NOT NULL,
    id_pago         NUMBER          NOT NULL,   -- FK al pago registrado previamente
    fecha_reserva   DATE            NOT NULL,
    hora_inicio     VARCHAR2(5)     NOT NULL,   -- HH24:MI
    hora_fin        VARCHAR2(5)     NOT NULL,   -- HH24:MI
    estado          VARCHAR2(15)    DEFAULT 'APARTADA' NOT NULL,
    fecha_creacion  DATE            DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_reserva_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_reserva_area    FOREIGN KEY (id_area)    REFERENCES AREA_SOCIAL(id_area),
    CONSTRAINT fk_reserva_pago    FOREIGN KEY (id_pago)    REFERENCES PAGO(id_pago),
    CONSTRAINT chk_reserva_estado CHECK (estado IN ('APARTADA','CANCELADA'))
);

-- Auditoría de cancelaciones de reservas por administrador (RN-AU1, RN-AU2)
CREATE TABLE AUDITORIA_RESERVA (
    id_auditoria    NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_reserva      NUMBER          NOT NULL,
    id_admin        NUMBER          NOT NULL,
    motivo          VARCHAR2(300),
    fecha_accion    DATE            DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_audit_reserva FOREIGN KEY (id_reserva) REFERENCES RESERVA(id_reserva),
    CONSTRAINT fk_audit_admin   FOREIGN KEY (id_admin)   REFERENCES USUARIO(id_usuario)
);

-- Trigger: bloquea reserva si el usuario tiene cargos pendientes (RN-R5)
CREATE OR REPLACE TRIGGER trg_reserva_sin_deuda
BEFORE INSERT ON RESERVA
FOR EACH ROW
DECLARE
    v_deuda     NUMBER;
    v_propiedad NUMBER;
BEGIN
    BEGIN
        SELECT id_propiedad INTO v_propiedad
        FROM USUARIO_PROPIEDAD
        WHERE id_usuario = :NEW.id_usuario
          AND activo     = 1
          AND ROWNUM     = 1;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN v_propiedad := NULL;
    END;

    IF v_propiedad IS NOT NULL THEN
        SELECT COUNT(*) INTO v_deuda
        FROM CARGO
        WHERE id_propiedad = v_propiedad AND estado = 'PENDIENTE';

        IF v_deuda > 0 THEN
            RAISE_APPLICATION_ERROR(-20005,
                'RN-R5: No puede reservar mientras tenga cargos pendientes de pago.');
        END IF;
    END IF;
END;
/

-- Trigger: bloquea reserva si el usuario está inactivo (RN-X3)
CREATE OR REPLACE TRIGGER trg_reserva_usuario_activo
BEFORE INSERT ON RESERVA
FOR EACH ROW
DECLARE
    v_activo NUMBER;
BEGIN
    SELECT activo INTO v_activo
    FROM USUARIO
    WHERE id_usuario = :NEW.id_usuario;

    IF v_activo = 0 THEN
        RAISE_APPLICATION_ERROR(-20006,
            'RN-X3: Un usuario inactivo no puede realizar reservas.');
    END IF;
END;
/

-- Trigger: valida que el área no esté reservada en ese horario (RN-R3)
CREATE OR REPLACE TRIGGER trg_area_disponible
BEFORE INSERT ON RESERVA
FOR EACH ROW
DECLARE
    v_conflicto NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_conflicto
    FROM RESERVA
    WHERE id_area       = :NEW.id_area
      AND fecha_reserva = :NEW.fecha_reserva
      AND estado        = 'APARTADA'
      AND :NEW.hora_inicio < hora_fin
      AND :NEW.hora_fin    > hora_inicio;

    IF v_conflicto > 0 THEN
        RAISE_APPLICATION_ERROR(-20007,
            'RN-R3: El área ya está reservada en ese horario.');
    END IF;
END;
/


-- =============================================================================
-- NIVEL 7: INVITACIONES (RN-I1 … RN-I5)
-- =============================================================================

CREATE TABLE INVITACION (
    id_invitacion       NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario          NUMBER          NOT NULL,
    id_tipo             NUMBER          NOT NULL,
    nombre_visitante    VARCHAR2(150)   NOT NULL,
    codigo_qr           VARCHAR2(500)   NOT NULL,
    fecha_generacion    DATE            DEFAULT SYSDATE NOT NULL,
    -- NULL = invitación de Servicio sin expiración (RN-I3)
    fecha_expiracion    DATE,
    activo              NUMBER(1)       DEFAULT 1 NOT NULL,
    CONSTRAINT fk_inv_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_inv_tipo    FOREIGN KEY (id_tipo)    REFERENCES TIPO_INVITACION(id_tipo),
    CONSTRAINT uq_inv_qr      UNIQUE (codigo_qr),
    CONSTRAINT chk_inv_activo CHECK (activo IN (0,1))
);


-- =============================================================================
-- NIVEL 8: CONTROL DE ACCESO (RN-AC1 … RN-AC5)
-- =============================================================================

CREATE TABLE ACCESO_VISITANTE (
    id_acceso               NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_invitacion           NUMBER          NOT NULL,
    id_guardia              NUMBER          NOT NULL,
    tipo_documento          VARCHAR2(20)    NOT NULL,
    numero_documento        VARCHAR2(50)    NOT NULL,
    nombre_completo_real    VARCHAR2(150)   NOT NULL,
    hora_ingreso            DATE            DEFAULT SYSDATE NOT NULL,
    observaciones           VARCHAR2(300),
    CONSTRAINT fk_acceso_inv     FOREIGN KEY (id_invitacion) REFERENCES INVITACION(id_invitacion),
    CONSTRAINT fk_acceso_guardia FOREIGN KEY (id_guardia)    REFERENCES USUARIO(id_usuario),
    CONSTRAINT chk_acceso_doc    CHECK (tipo_documento IN ('DPI','Licencia'))
);

-- Trigger: valida que la invitación esté activa y no haya expirado (RN-I3, RN-I5)
CREATE OR REPLACE TRIGGER trg_validar_invitacion
BEFORE INSERT ON ACCESO_VISITANTE
FOR EACH ROW
DECLARE
    v_activo     NUMBER;
    v_expiracion DATE;
    v_tipo       VARCHAR2(50);
BEGIN
    SELECT i.activo, i.fecha_expiracion, ti.nombre
    INTO v_activo, v_expiracion, v_tipo
    FROM INVITACION i
    JOIN TIPO_INVITACION ti ON i.id_tipo = ti.id_tipo
    WHERE i.id_invitacion = :NEW.id_invitacion;

    IF v_activo = 0 THEN
        RAISE_APPLICATION_ERROR(-20008,
            'RN-I5: Esta invitación ha sido desactivada.');
    END IF;

    IF v_tipo = 'Normal' AND TRUNC(SYSDATE) > TRUNC(v_expiracion) THEN
        RAISE_APPLICATION_ERROR(-20009,
            'RN-I3: Esta invitación ha expirado.');
    END IF;
END;
/

-- Trigger: desactiva la invitación Normal tras su uso (RN-I5)
CREATE OR REPLACE TRIGGER trg_desactivar_inv_normal
AFTER INSERT ON ACCESO_VISITANTE
FOR EACH ROW
DECLARE
    v_tipo VARCHAR2(50);
BEGIN
    SELECT ti.nombre INTO v_tipo
    FROM INVITACION i
    JOIN TIPO_INVITACION ti ON i.id_tipo = ti.id_tipo
    WHERE i.id_invitacion = :NEW.id_invitacion;

    IF v_tipo = 'Normal' THEN
        UPDATE INVITACION SET activo = 0
        WHERE id_invitacion = :NEW.id_invitacion;
    END IF;
END;
/


-- =============================================================================
-- NIVEL 9: LLAMADOS DE ATENCIÓN (RN-C2, RN-F1, RN-AU1)
-- id_tipo_cargo referencia solo registros con es_multa = 1
-- Al 3er llamado del mismo tipo se genera multa con monto del catálogo
-- El contador se reinicia cada 3 llamados
-- =============================================================================

CREATE TABLE LLAMADO_ATENCION (
    id_llamado      NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_propiedad    NUMBER          NOT NULL,
    id_admin        NUMBER          NOT NULL,
    id_tipo_cargo   NUMBER          NOT NULL,   -- debe ser es_multa = 1
    descripcion     VARCHAR2(500)   NOT NULL,
    fecha_emision   DATE            DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_llamado_prop      FOREIGN KEY (id_propiedad) REFERENCES PROPIEDAD(id_propiedad),
    CONSTRAINT fk_llamado_admin     FOREIGN KEY (id_admin)     REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_llamado_tipo      FOREIGN KEY (id_tipo_cargo) REFERENCES TIPO_CARGO(id_tipo_cargo)
);

-- Trigger: valida que el tipo de cargo sea una multa (es_multa = 1)
CREATE OR REPLACE TRIGGER trg_llamado_solo_multas
BEFORE INSERT ON LLAMADO_ATENCION
FOR EACH ROW
DECLARE
    v_es_multa NUMBER;
BEGIN
    SELECT es_multa INTO v_es_multa
    FROM TIPO_CARGO
    WHERE id_tipo_cargo = :NEW.id_tipo_cargo;

    IF v_es_multa = 0 THEN
        RAISE_APPLICATION_ERROR(-20010,
            'Un llamado de atención solo puede referencia un tipo de cargo de tipo multa.');
    END IF;
END;
/

-- Trigger: al 3er llamado del mismo tipo genera multa automáticamente y reinicia contador (RN-F1)
CREATE OR REPLACE TRIGGER trg_tercer_llamado_multa
AFTER INSERT ON LLAMADO_ATENCION
FOR EACH ROW
DECLARE
    v_count  NUMBER;
    v_monto  NUMBER;
BEGIN
    -- Contar llamados activos del mismo tipo para esta propiedad
    SELECT COUNT(*) INTO v_count
    FROM LLAMADO_ATENCION
    WHERE id_propiedad  = :NEW.id_propiedad
      AND id_tipo_cargo = :NEW.id_tipo_cargo;

    IF MOD(v_count, 3) = 0 THEN
        -- Tomar el monto del catálogo (TIPO_CARGO)
        SELECT monto INTO v_monto
        FROM TIPO_CARGO
        WHERE id_tipo_cargo = :NEW.id_tipo_cargo;

        INSERT INTO CARGO (id_propiedad, id_tipo_cargo, monto, descripcion, estado)
        VALUES (
            :NEW.id_propiedad,
            :NEW.id_tipo_cargo,
            v_monto,
            'Multa automática: 3er llamado por ' || (SELECT nombre FROM TIPO_CARGO WHERE id_tipo_cargo = :NEW.id_tipo_cargo),
            'PENDIENTE'
        );
    END IF;
END;
/


-- =============================================================================
-- NIVEL 10: TICKETS DE EMPLEADOS
-- =============================================================================

CREATE TABLE TICKET (
    id_ticket       NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_asignado_a   NUMBER          NOT NULL,
    id_asignado_por NUMBER          NOT NULL,
    id_prioridad    NUMBER          NOT NULL,
    titulo          VARCHAR2(150)   NOT NULL,
    descripcion     VARCHAR2(1000)  NOT NULL,
    estado          VARCHAR2(20)    DEFAULT 'ABIERTO' NOT NULL,
    fecha_creacion  DATE            DEFAULT SYSDATE NOT NULL,
    fecha_limite    DATE,
    fecha_cierre    DATE,
    notas_cierre    VARCHAR2(500),
    CONSTRAINT fk_ticket_asig_a   FOREIGN KEY (id_asignado_a)   REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_ticket_asig_por FOREIGN KEY (id_asignado_por) REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_ticket_prio     FOREIGN KEY (id_prioridad)    REFERENCES PRIORIDAD_TICKET(id_prioridad),
    CONSTRAINT chk_ticket_estado  CHECK (estado IN ('ABIERTO','EN_PROGRESO','RESUELTO','CERRADO','CANCELADO'))
);

-- Historial de cambios de estado de tickets
CREATE TABLE TICKET_HISTORIAL (
    id_historial    NUMBER          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_ticket       NUMBER          NOT NULL,
    id_usuario      NUMBER          NOT NULL,
    estado_anterior VARCHAR2(20),
    estado_nuevo    VARCHAR2(20)    NOT NULL,
    comentario      VARCHAR2(500),
    fecha_cambio    DATE            DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_th_ticket  FOREIGN KEY (id_ticket)  REFERENCES TICKET(id_ticket),
    CONSTRAINT fk_th_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);

-- Trigger: solo guardias y colaboradores reciben tickets, solo admin los crea
CREATE OR REPLACE TRIGGER trg_ticket_rol_valido
BEFORE INSERT ON TICKET
FOR EACH ROW
DECLARE
    v_rol_receptor VARCHAR2(50);
    v_rol_emisor   VARCHAR2(50);
BEGIN
    SELECT r.nombre INTO v_rol_receptor
    FROM USUARIO u JOIN ROL r ON u.id_rol = r.id_rol
    WHERE u.id_usuario = :NEW.id_asignado_a;

    SELECT r.nombre INTO v_rol_emisor
    FROM USUARIO u JOIN ROL r ON u.id_rol = r.id_rol
    WHERE u.id_usuario = :NEW.id_asignado_por;

    IF v_rol_receptor NOT IN ('Guardia','Colaborador') THEN
        RAISE_APPLICATION_ERROR(-20011,
            'Los tickets solo pueden asignarse a Guardias o Colaboradores.');
    END IF;

    IF v_rol_emisor <> 'Administrador' THEN
        RAISE_APPLICATION_ERROR(-20012,
            'Solo el Administrador puede crear y asignar tickets.');
    END IF;
END;
/

-- Trigger: registra historial automáticamente al cambiar estado
CREATE OR REPLACE TRIGGER trg_ticket_historial
AFTER UPDATE OF estado ON TICKET
FOR EACH ROW
BEGIN
    INSERT INTO TICKET_HISTORIAL
        (id_ticket, id_usuario, estado_anterior, estado_nuevo, comentario)
    VALUES
        (:NEW.id_ticket, :NEW.id_asignado_por, :OLD.estado, :NEW.estado, :NEW.notas_cierre);
END;
/



-- =============================================================================
-- DATOS SEMILLA
-- =============================================================================

-- Roles (RN-U1)
INSERT INTO ROL (nombre, descripcion) VALUES ('Residente',     'Propietario o inquilino de una unidad');
INSERT INTO ROL (nombre, descripcion) VALUES ('Administrador', 'Gestiona el condominio');
INSERT INTO ROL (nombre, descripcion) VALUES ('Guardia',       'Control de acceso y seguridad');
INSERT INTO ROL (nombre, descripcion) VALUES ('Colaborador',   'Limpieza y mantenimiento');

-- Tipos de invitación (RN-I2)
INSERT INTO TIPO_INVITACION (nombre, descripcion)
    VALUES ('Normal',   'Visita personal de un solo uso, expira a las 23:59 del día');
INSERT INTO TIPO_INVITACION (nombre, descripcion)
    VALUES ('Servicio', 'Empleado doméstico o proveedor, reutilizable hasta desactivación');

-- Tipos de cargo (RN-F1)
-- Cargos calculados dinámicamente (es_multa = 0, monto = 0)
INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa)
    VALUES ('Cuota condominio', 'Pago mensual obligatorio por propiedad',         0, 0);
INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa)
    VALUES ('Mora',             'Recargo automático por cuota no pagada al día 11', 0, 0);
INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa)
    VALUES ('Reserva de área',  'Pago por uso de área social',                    0, 0);

-- Multas con monto fijo (es_multa = 1)
INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa)
    VALUES ('Multa ruido excesivo',      'Ruido fuera de horario permitido',         200.00, 1);
INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa)
    VALUES ('Multa daño áreas comunes',  'Daño a instalaciones del condominio',      500.00, 1);
INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa)
    VALUES ('Multa mascotas sin correa', 'Mascota sin correa en áreas comunes',      150.00, 1);
INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa)
    VALUES ('Multa basura incorrecta',   'Depósito incorrecto de basura',            100.00, 1);

-- Categorías de propiedad (RN-P5)
INSERT INTO CATEGORIA_PROPIEDAD (nombre, descripcion,                    max_parqueos, cuota_mensual)
    VALUES ('Básica',     'Unidad residencial estándar',                 1,            500.00);
INSERT INTO CATEGORIA_PROPIEDAD (nombre, descripcion,                    max_parqueos, cuota_mensual)
    VALUES ('Intermedia', 'Unidad con espacio adicional',                2,            800.00);
INSERT INTO CATEGORIA_PROPIEDAD (nombre, descripcion,                    max_parqueos, cuota_mensual)
    VALUES ('Completa',   'Unidad amplia con todas las amenidades',      3,            1200.00);

-- Áreas sociales fijas (RN-A1, RN-A2)
INSERT INTO AREA_SOCIAL (nombre, descripcion, hora_apertura, hora_cierre, precio_por_hora)
    VALUES ('Salón Social',         'Salón para eventos y reuniones',  '08:00','22:00', 50.00);
INSERT INTO AREA_SOCIAL (nombre, descripcion, hora_apertura, hora_cierre, precio_por_hora)
    VALUES ('Cancha de Fútbol',     'Cancha de fútbol 7',              '08:00','22:00', 30.00);
INSERT INTO AREA_SOCIAL (nombre, descripcion, hora_apertura, hora_cierre, precio_por_hora)
    VALUES ('Cancha de Basketball', 'Cancha de basketball techada',    '08:00','22:00', 25.00);
INSERT INTO AREA_SOCIAL (nombre, descripcion, hora_apertura, hora_cierre, precio_por_hora)
    VALUES ('Piscina',              'Piscina con área de descanso',    '08:00','22:00', 20.00);

-- Prioridades de ticket
INSERT INTO PRIORIDAD_TICKET (nombre, nivel) VALUES ('Baja',    1);
INSERT INTO PRIORIDAD_TICKET (nombre, nivel) VALUES ('Media',   2);
INSERT INTO PRIORIDAD_TICKET (nombre, nivel) VALUES ('Alta',    3);
INSERT INTO PRIORIDAD_TICKET (nombre, nivel) VALUES ('Urgente', 4);

-- Configuración dinámica (RN-C1)
INSERT INTO CONFIGURACION (clave, valor, descripcion, tipo_dato)
    VALUES ('DIA_GENERACION_CUOTA', '1',  'Día del mes en que se genera la cuota mensual',     'NUMBER');
INSERT INTO CONFIGURACION (clave, valor, descripcion, tipo_dato)
    VALUES ('DIA_GENERACION_MORA',  '11', 'Día del mes en que se genera la mora si hay deuda', 'NUMBER');
INSERT INTO CONFIGURACION (clave, valor, descripcion, tipo_dato)
    VALUES ('PORCENTAJE_MORA',      '5',  'Porcentaje de mora sobre la cuota mensual',         'NUMBER');

COMMIT;

-- =============================================================================
-- FIN DEL ESQUEMA v3.0
-- =============================================================================