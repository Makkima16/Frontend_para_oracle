import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { ClientsService } from '../../../services/clients.service';
import { PayService } from '../../../services/pay.service';
import { PagosService } from '../../../services/pagos.service';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements OnInit{
  handler: any;
  Paydata: any;
  isPriceInfoOpen = false;
  isDurationInfoOpen = false;
  isTypeInfoOpen = false;

  email_client:string;
  cliente_id:number;
  role:string;
  name:string;
  session = JSON.parse(sessionStorage.getItem('sesion'));  // Usamos sessionStorage para la sesión
  public datasets: any;
  public data: any;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  isPaid: boolean = false; // Inicialmente asumimos que no ha pagado
  theFormGroup: any;
  trySend: boolean;
  ref:string;
  monto:number;
  transaccion_id:string;
  descripcion:string;
  constructor(
    private router: Router,
    private service: ClientsService,
    private pagoSerivces: PagosService,
    private route: ActivatedRoute
  ) {}

  toggleInfo(section: string): void {
    if (section === 'price') {
      this.isPriceInfoOpen = !this.isPriceInfoOpen;
    }
    if (section === 'duration') {
      this.isDurationInfoOpen = !this.isDurationInfoOpen;
    }
    if (section === 'tipo') {
      this.isTypeInfoOpen = !this.isTypeInfoOpen;
    }
  }
  ngOnInit(): void {
    // Primero obtenemos los partidos
    this.route.queryParams.subscribe((params) => {
      this.monto = params['monto']; // Captura el monto
      this.transaccion_id = params['transaccion_id']; // Captura el ID de la transacción
      this.descripcion = params['descripcion']; // Captura la descripción
      console.log('Monto:', this.monto);
      console.log('ID de Transacción:', this.transaccion_id);
      console.log('Descripción:', this.descripcion);
    });

    this.guardarid()
    this.initializeEpaycoButton();  // Inicializar el botón de pago
  }
  initializeEpaycoButton(): void {
    // Asegúrate de que el script de ePayco está cargado antes de configurar el handler
    if ((window as any).ePayco) {
      // Configuración de ePayco
      this.handler = (window as any).ePayco.checkout.configure({
        key: environment.epayco_public_key,
        test: true,  // En producción, pon test: false
      });
  
      const invoiceNumber = uuidv4(); // Generamos un ID único para la factura
  
      // Configuración de los datos del pago
      this.Paydata = {
        name: 'Recarga tu saldo',
        description: this.descripcion,
        invoice: invoiceNumber,
        currency: 'cop',
        amount: this.monto,
        tax_base: this.monto,
        tax: '',
        tax_ico: '0',
        country: 'co',
        lang: 'es',
        external: true,
        name_billing: '',
        address_billing: '',
        type_doc_billing: 'cc',
        mobilephone_billing: '',
        number_doc_billing: '',
        email_billing: this.email_client,
        extra1: this.transaccion_id // Asegúrate de que se almacene como string en el pago
      };
    } else {
      console.error('ePayco script no cargó correctamente');
      Swal.fire({
        icon: 'error',
        title: 'Error de pago',
        text: 'Hubo un problema al cargar la plataforma de pago. Inténtelo nuevamente.',
        allowOutsideClick: false
      });
    }
  }
  pay(): void {
    if(this.cliente_id==undefined){
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'Primero Logueese por favor',
        allowOutsideClick: false
      });

    }else{
      if (this.handler) {
        this.handler.open(this.Paydata);
      } else {
        console.error('ePayco handler no está configurado');
      }
    }
  }
  guardarid() {
    const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;
  
    if (token) {
      const decodedToken = this.decodeToken(token);
      this.email_client = decodedToken.email;
      this.name = decodedToken.name;
      this.role = decodedToken?.role?.name;
      
      if (this.email_client) {
        this.service.list().subscribe(data => {
          const cliente = data['data'];
          cliente.password = ''; 
          const ClienteEncontrado = cliente.find(cliente => cliente.email === this.email_client);
          if (ClienteEncontrado) {
            this.email_client = this.email_client;
            this.cliente_id = ClienteEncontrado.id;

          } else {
            sessionStorage.removeItem('sesion');
          }
        });
      } else {
        console.error('No hay email almacenado en el token');
      }
    } else {
      console.error('No existe una sesión');
    }
  }
  







  // Función que decodifica el token JWT manualmente
  decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token inválido');
    }

    const payload = parts[1];  // El payload es la segunda parte
    const decoded = atob(payload);  // Decodificamos de base64
    return JSON.parse(decoded);  // Retornamos el payload como un objeto
  }


    
}
