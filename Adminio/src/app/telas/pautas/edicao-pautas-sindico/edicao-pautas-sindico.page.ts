import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ToastController } from '@ionic/angular';
import { Post } from 'src/services/post';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edicao-pautas-sindico',
  templateUrl: './edicao-pautas-sindico.page.html',
  styleUrls: ['./edicao-pautas-sindico.page.scss'],
})
export class EdicaoPautasSindicoPage implements OnInit {
  assunto: string = "";
  conteudo: string = "";
  pauta_id: string = "";
  status: string = "";

  sindico: string = "";
  senha: string = "";

  sindicos: any = [];

  sindico_id: string = "";
  nome: string = "";

  sindico_fk: number = 0;


  constructor(private actRouter: ActivatedRoute, private router: Router, private provider: Post, public toast: ToastController, private storage: NativeStorage) { }

  ngOnInit() {

    this.actRouter.params.subscribe((data:any)=>{
      this.pauta_id = data.pauta_id;
      this.assunto = data.assunto;
      this.conteudo = data.conteudo;
      this.status = data.status;

      this.sindico_id = data.sindico_id;
      this.nome = data.nome;

      

    });

    return new Promise(resolve=> {
      let dados = {
        requisicao :'listarsindico'
      };
      this.provider.dadosApi(dados,'api_listar.php').subscribe(data => {
         console.log(data);
        this.sindicos= data;
      });
    });
   
  }

  segmentChanged(sindicos:any){
    this.sindico_fk = sindicos.detail.value;
    console.log(sindicos)
  }

  pauthomesind(){
    this.router.navigate(['/pautas-home-sindico']);
  }

  async enviaredit(pauta_id){

    return new Promise(resolve => {
      
      let dados = {
        requisicao : 'editpaut',
        assunto : this.assunto, 
        conteudo : this.conteudo,
        status : this.status,
        pautas_sindico_id : this.sindico_fk,
        senha: this.senha,
        pauta_id: pauta_id

      };

        this.provider.dadosApi(dados, 'api_adm.php').subscribe(async data => {

          var alert = data['msg'];
          if(data['pagepautedit']) {
            this.storage.setItem('session_storage', data['result']);
            if(data['success']){
              this.router.navigate([ '/pautas-home-sindico']);
            }
            this.mensagemSalvar();
            this.sindico = "";
            this.senha = "";
            console.log(data);
          }else{
            const toast = await this.toast.create({
              message: alert,
              duration: 3000,
              color: 'danger'
            });
            toast.present();
            console.log(data)
          }
          
        });
    });

  }

  async mensagemSalvar() {
    const toast = await this.toast.create({
      message: 'Salvo com Sucesso!!',
      duration: 1000
    });
    toast.present();
  }

}
